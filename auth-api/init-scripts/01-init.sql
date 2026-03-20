-- ============================================
-- 数据库初始化脚本
-- 
-- 创建必要的扩展和初始配置
-- ============================================

-- 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 启用 pgcrypto 扩展（用于加密函数）
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 创建更新时间的触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 注释
COMMENT ON FUNCTION update_updated_at_column() IS '自动更新 updated_at 字段的触发器函数';

-- ============================================
-- 创建 users 表
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id            UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone         VARCHAR(20)   NOT NULL,
    nickname      VARCHAR(50)   NOT NULL,
    password_hash VARCHAR(255)  NOT NULL,
    avatar_url    VARCHAR(500),
    status        VARCHAR(20)   NOT NULL DEFAULT 'active'
                                CHECK (status IN ('active','inactive','suspended')),
    last_login_at TIMESTAMPTZ,
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at    TIMESTAMPTZ
);

-- 唯一索引：手机号
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_phone_unique ON users (phone) WHERE deleted_at IS NULL;

-- 普通索引
CREATE INDEX IF NOT EXISTS idx_users_nickname   ON users (nickname);
CREATE INDEX IF NOT EXISTS idx_users_status     ON users (status);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users (created_at);

-- 自动更新 updated_at 触发器
CREATE TRIGGER set_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE users IS '用户表';
