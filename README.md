<!--
 * @Author: Diana Tang
-->
# testpilot
自动化测试MCP
testpilot/
├── src/
│   ├── scanner.ts           # 扫描项目结构和依赖
│   ├── generator.ts         # 生成测试脚本 stub
│   ├── runner.ts            # 自动运行测试
│   └── reporter.ts          # 格式化输出测试结果
├── templates/
│   └── jest.test.stub.ts    # 测试 stub 模板
├── index.ts                 # CLI 入口
├── package.json
