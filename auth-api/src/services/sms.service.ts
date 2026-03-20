/**
 * 短信服务模块
 *
 * 提供短信发送功能，支持 Twilio 和开发模式（仅打日志）。
 * 生产环境必须完整配置 Twilio 凭据，否则启动时将抛出错误。
 */

import twilio from 'twilio';
import config from '../config/config';
import logger from '../utils/logger';

const isProd = config.server.nodeEnv === 'production';

// ─── Twilio 客户端（懒加载单例） ──────────────────────────────────────────────

let twilioClient: twilio.Twilio | null = null;

const getTwilioClient = (): twilio.Twilio | null => {
  if (twilioClient) return twilioClient;

  const { accountSid, authToken } = config.twilio;

  if (!accountSid || !authToken) {
    if (isProd) {
      // 生产环境：Twilio 未配置视为严重错误
      throw new Error(
        '[SMS] Twilio credentials are required in production. ' +
        'Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN environment variables.',
      );
    }
    logger.warn('[SMS] Twilio credentials not configured — SMS will be logged only (dev mode).');
    return null;
  }

  try {
    twilioClient = twilio(accountSid, authToken);
    logger.info('[SMS] Twilio client initialized.');
    return twilioClient;
  } catch (error) {
    logger.error('[SMS] Failed to initialize Twilio client:', error);
    if (isProd) throw error; // 生产环境初始化失败直接崩溃
    return null;
  }
};

// ─── 公共类型 ─────────────────────────────────────────────────────────────────

export interface SMSSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// ─── 核心发送函数 ─────────────────────────────────────────────────────────────

/**
 * 发送短信
 *
 * @param to   收件手机号（中国大陆格式，自动转为国际格式）
 * @param body 短信内容
 */
export const sendSMS = async (to: string, body: string): Promise<SMSSendResult> => {
  const formattedPhone = formatPhoneNumber(to);

  // 开发 / 测试环境：仅打日志，不实际发送
  if (!isProd) {
    logger.info(`[SMS][DEV] To: ${maskPhone(formattedPhone)} | Body: ${body}`);
    return { success: true, messageId: `dev-${Date.now()}` };
  }

  try {
    const client = getTwilioClient();

    if (!client) {
      // 生产环境已在 getTwilioClient 中抛出异常，此处不可达；保留作防御
      logger.error('[SMS] Twilio client unavailable in production.');
      return { success: false, error: 'Twilio client unavailable' };
    }

    if (!config.twilio.phoneNumber) {
      throw new Error('[SMS] TWILIO_PHONE_NUMBER is not configured.');
    }

    const message = await client.messages.create({
      body,
      to: formattedPhone,
      from: config.twilio.phoneNumber,
    });

    logger.info(`[SMS] Sent to ${maskPhone(formattedPhone)}, SID: ${message.sid}`);
    return { success: true, messageId: message.sid };
  } catch (error: any) {
    logger.error(`[SMS] Failed to send to ${maskPhone(formattedPhone)}:`, {
      message: error?.message,
      code: error?.code,
    });
    return { success: false, error: error?.message ?? 'Unknown error' };
  }
};

// ─── 场景化发送函数 ───────────────────────────────────────────────────────────

/**
 * 发送验证码短信
 */
export const sendVerificationCode = async (
  phone: string,
  code: string,
  scene: 'login' | 'register' | 'reset_password',
): Promise<SMSSendResult> => {
  const sceneNames: Record<string, string> = {
    login: '登录',
    register: '注册',
    reset_password: '密码重置',
  };
  const sceneName = sceneNames[scene] ?? '验证';
  const body = `【AuthAPI】您的${sceneName}验证码是：${code}，5分钟内有效。请勿泄露给他人。`;
  return sendSMS(phone, body);
};

/**
 * 发送登录通知短信
 */
export const sendLoginNotification = async (
  phone: string,
  device: string,
  location: string,
): Promise<SMSSendResult> => {
  const body =
    `【AuthAPI】您的账号于 ${new Date().toLocaleString('zh-CN')} ` +
    `在 ${location} 使用 ${device} 登录。如非本人操作，请立即修改密码。`;
  return sendSMS(phone, body);
};

/**
 * 发送密码修改通知
 */
export const sendPasswordChangeNotification = async (
  phone: string,
): Promise<SMSSendResult> => {
  const body =
    `【AuthAPI】您的账号密码已于 ${new Date().toLocaleString('zh-CN')} ` +
    `修改。如非本人操作，请立即联系客服。`;
  return sendSMS(phone, body);
};

// ─── 工具函数 ─────────────────────────────────────────────────────────────────

/** 将中国大陆手机号转为国际格式（+86XXXXXXXXXXX） */
const formatPhoneNumber = (phone: string): string => {
  if (phone.startsWith('+')) return phone;
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11 && cleaned.startsWith('1')) return `+86${cleaned}`;
  return `+86${cleaned}`;
};

/** 掩码手机号，保护隐私 */
const maskPhone = (phone: string): string => {
  if (!phone || phone.length < 7) return phone;
  return phone.replace(/(\+?\d{3})\d{4}(\d{4})/, '$1****$2');
};

/** 检查 Twilio 是否已完整配置 */
export const isTwilioConfigured = (): boolean =>
  !!(config.twilio.accountSid && config.twilio.authToken && config.twilio.phoneNumber);

/** 获取短信服务当前状态 */
export const getSMSStatus = (): { configured: boolean; mode: string; fromNumber?: string } => ({
  configured: isTwilioConfigured(),
  mode: config.server.nodeEnv,
  fromNumber: config.twilio.phoneNumber || undefined,
});
