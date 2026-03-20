import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import './AIAssistant.css';
import aiimg2 from '../../components/ai.png'
export default function AIAssistant() {
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 }); // 相对偏移量
  const [isDragging, setIsDragging] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0, initialX: 0, initialY: 0 });
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDraggingRef = useRef(false);

  // 初始化位置 - 右下角
  useEffect(() => {
    const updateInitialPosition = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setPosition({
          x: window.innerWidth - rect.width - 24,
          y: window.innerHeight - rect.height - 100
        });
      }
    };
    updateInitialPosition();
    window.addEventListener('resize', updateInitialPosition);
    return () => window.removeEventListener('resize', updateInitialPosition);
  }, []);

  // 处理鼠标/触摸按下
  const handlePressStart = useCallback((clientX: number, clientY: number) => {
    setIsPressed(true);
    dragStartRef.current = {
      x: clientX,
      y: clientY,
      initialX: position.x,
      initialY: position.y
    };

    // 长按500ms后开始拖拽
    longPressTimerRef.current = setTimeout(() => {
      isDraggingRef.current = true;
      setIsDragging(true);
    }, 500);
  }, [position.x, position.y]);

  // 处理鼠标/触摸移动
  const handlePressMove = useCallback((clientX: number, clientY: number) => {
    if (!isPressed) return;

    const deltaX = Math.abs(clientX - dragStartRef.current.x);
    const deltaY = Math.abs(clientY - dragStartRef.current.y);

    // 如果移动超过5像素，取消长按计时器
    if ((deltaX > 5 || deltaY > 5) && !isDraggingRef.current && longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    // 如果正在拖拽，更新位置
    if (isDraggingRef.current) {
      const newX = dragStartRef.current.initialX + (clientX - dragStartRef.current.x);
      const newY = dragStartRef.current.initialY + (clientY - dragStartRef.current.y);
      
      // 限制在视窗内
      const maxX = window.innerWidth - 100;
      const maxY = window.innerHeight - 180;
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
  }, [isPressed]);

  // 处理鼠标/触摸结束
  const handlePressEnd = useCallback(() => {
    setIsPressed(false);
    setIsDragging(false);
    isDraggingRef.current = false;
    
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  // 鼠标事件
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handlePressStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handlePressMove(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    handlePressEnd();
  };

  // 触摸事件
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handlePressStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handlePressMove(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    handlePressEnd();
  };

  // 全局事件监听
  useEffect(() => {
    if (isPressed) {
      const handleGlobalMouseMove = (e: MouseEvent) => handlePressMove(e.clientX, e.clientY);
      const handleGlobalMouseUp = () => handlePressEnd();
      const handleGlobalTouchMove = (e: TouchEvent) => {
        const touch = e.touches[0];
        handlePressMove(touch.clientX, touch.clientY);
      };
      const handleGlobalTouchEnd = () => handlePressEnd();

      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
      document.addEventListener('touchend', handleGlobalTouchEnd);

      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
        document.removeEventListener('touchmove', handleGlobalTouchMove);
        document.removeEventListener('touchend', handleGlobalTouchEnd);
      };
    }
  }, [isPressed, handlePressMove, handlePressEnd]);

  return (
    <div 
      ref={containerRef}
      className={`ai-assistant-container ${isDragging ? 'dragging' : ''} ${isPressed ? 'pressed' : ''}`}
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        right: 'auto',
        bottom: 'auto'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 悬停提示 */}
      {isHovered && !isDragging && (
        <div className="ai-tooltip">
          <Sparkles size={14} />
          <span>AI智能助手，随时为您解答</span>
        </div>
      )}
      
      {/* 拖拽提示 */}
      {isDragging && (
        <div className="ai-drag-tooltip">
          <span>拖动中...</span>
        </div>
      )}
      
      {/* AI助手按钮 - 直接使用小医生图片 */}
      <Link 
        to="/ai"
        className="ai-assistant-btn"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={(e) => {
          if (isDraggingRef.current) {
            e.preventDefault();
          }
        }}
      >
        <img 
          src={aiimg2}
          alt="AI助手" 
          className="ai-assistant-img"
          draggable={false}
        />
        


      </Link>
    </div>
  );
}
