# ============================================
# Auth API Makefile
# 
# 提供常用的开发和部署命令
# ============================================

.PHONY: help install dev build start test lint clean docker-build docker-up docker-down

# 默认目标
.DEFAULT_GOAL := help

# 颜色定义
BLUE := \033[36m
GREEN := \033[32m
YELLOW := \033[33m
RED := \033[31m
RESET := \033[0m

# ============================================
# 帮助
# ============================================
help: ## 显示帮助信息
	@echo "$(BLUE)Auth API 可用命令:$(RESET)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-20s$(RESET) %s\n", $$1, $$2}'

# ============================================
# 开发命令
# ============================================
install: ## 安装依赖
	@echo "$(BLUE)Installing dependencies...$(RESET)"
	npm install

dev: ## 启动开发服务器
	@echo "$(GREEN)Starting development server...$(RESET)"
	npm run dev

build: ## 编译 TypeScript
	@echo "$(BLUE)Building TypeScript...$(RESET)"
	npm run build

start: build ## 启动生产服务器
	@echo "$(GREEN)Starting production server...$(RESET)"
	npm start

# ============================================
# 测试命令
# ============================================
test: ## 运行测试
	@echo "$(BLUE)Running tests...$(RESET)"
	npm test

test-coverage: ## 生成测试覆盖率报告
	@echo "$(BLUE)Generating test coverage...$(RESET)"
	npm run test:coverage

test-watch: ## 监视模式运行测试
	@echo "$(BLUE)Running tests in watch mode...$(RESET)"
	npm run test:watch

# ============================================
# 代码质量
# ============================================
lint: ## 运行 ESLint
	@echo "$(BLUE)Running ESLint...$(RESET)"
	npm run lint

lint-fix: ## 自动修复 ESLint 错误
	@echo "$(BLUE)Fixing ESLint errors...$(RESET)"
	npm run lint:fix

# ============================================
# Docker 命令
# ============================================
docker-build: ## 构建 Docker 镜像
	@echo "$(BLUE)Building Docker image...$(RESET)"
	docker build -t auth-api .

docker-up: ## 启动 Docker Compose（生产配置）
	@echo "$(GREEN)Starting Docker Compose...$(RESET)"
	docker-compose up -d

docker-down: ## 停止 Docker Compose
	@echo "$(YELLOW)Stopping Docker Compose...$(RESET)"
	docker-compose down

docker-dev-up: ## 启动开发环境 Docker Compose
	@echo "$(GREEN)Starting development Docker Compose...$(RESET)"
	docker-compose -f docker-compose.dev.yml up -d

docker-dev-down: ## 停止开发环境 Docker Compose
	@echo "$(YELLOW)Stopping development Docker Compose...$(RESET)"
	docker-compose -f docker-compose.dev.yml down

docker-logs: ## 查看 Docker 日志
	@echo "$(BLUE)Viewing Docker logs...$(RESET)"
	docker-compose logs -f

docker-clean: ## 清理 Docker 资源
	@echo "$(RED)Cleaning Docker resources...$(RESET)"
	docker-compose down -v
	docker system prune -f

# ============================================
# 数据库命令
# ============================================
db-migrate: ## 运行数据库迁移
	@echo "$(BLUE)Running database migrations...$(RESET)"
	npm run db:migrate

db-seed: ## 运行数据库种子
	@echo "$(BLUE)Running database seeds...$(RESET)"
	npm run db:seed

# ============================================
# 清理命令
# ============================================
clean: ## 清理构建文件
	@echo "$(RED)Cleaning build files...$(RESET)"
	rm -rf dist/
	rm -rf coverage/
	rm -rf logs/*.log

clean-all: clean docker-clean ## 清理所有文件和 Docker 资源
	@echo "$(RED)Cleaning all files and Docker resources...$(RESET)"
	rm -rf node_modules/

# ============================================
# 部署命令
# ============================================
deploy-check: ## 部署前检查
	@echo "$(BLUE)Running deployment checks...$(RESET)"
	npm run lint
	npm run build
	npm test

# ============================================
# 其他命令
# ============================================
generate-docs: ## 生成 API 文档
	@echo "$(BLUE)API documentation available at: http://localhost:3000/api-docs$(RESET)"

env-setup: ## 设置环境变量文件
	@echo "$(BLUE)Setting up environment files...$(RESET)"
	@if [ ! -f .env ]; then cp .env.example .env; echo "$(GREEN).env file created$(RESET)"; else echo "$(YELLOW).env file already exists$(RESET)"; fi
	@if [ ! -f .env.test ]; then cp .env.example .env.test; echo "$(GREEN).env.test file created$(RESET)"; else echo "$(YELLOW).env.test file already exists$(RESET)"; fi
