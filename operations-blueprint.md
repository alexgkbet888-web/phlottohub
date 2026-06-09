# 菲律宾 PCSO 走势图网站完整运营设计

## 1. 项目定位

网站定位：

Independent PCSO lotto results, trend charts, history and statistics platform.

中文理解：

菲律宾版 500 彩票走势图网站。彩种与开奖源换成 PCSO，核心产品不是普通开奖结果查询，而是高密度走势分析工具。

必须坚持：

- 不售票
- 不接受投注
- 不提供投注平台跳转
- 不承诺预测中奖
- 所有走势仅为历史数据参考
- 清晰标注 unofficial / independent / not affiliated with PCSO

## 2. PCSO 数据源判断

官方页面：

https://www.pcso.gov.ph/searchlottoresult.aspx

页面特点：

- 页面标题是 Search Lotto Draw Result by Date。
- 支持按 From / To 日期查询。
- 支持按彩种筛选。
- 页面直接输出 Search Results 表格。
- 表格字段包括 LOTTO GAME、COMBINATIONS、DRAW DATE、JACKPOT (PHP)、WINNERS。
- 页面可查询 2016 至 2026 年。

接口判断：

- 未发现公开 JSON API 文档。
- 页面看起来是 ASP.NET 服务端渲染页面。
- 可直接通过页面表格拿到最新和历史结果。
- 本地直连 PCSO 时可能触发 Akamai / EdgeSuite Access Denied，需要生产采集服务配置正常 User-Agent、请求频率、重试和缓存。

结论：

可以实时/准实时同步，但第一稳定方案不是调用官方 API，而是：

1. 定时请求官方查询页。
2. 解析 HTML 表格。
3. 标准化 game、drawDate、drawTime、numbers、jackpot、winners。
4. 入库并做幂等更新。
5. 异常进入人工审核。

## 3. YouTube 视频源

官方频道：

https://www.youtube.com/channel/UCpOm2kv1upnIFoOT7rSp6hg/videos

同步方式：

- 免费方案：YouTube RSS
  - https://www.youtube.com/feeds/videos.xml?channel_id=UCpOm2kv1upnIFoOT7rSp6hg
  - 适合同步最近上传视频。
  - 不需要 API key。

- 正式方案：YouTube Data API v3
  - 可获取标题、发布时间、缩略图、视频 ID、直播状态。
  - 可按关键词过滤 2PM、5PM、9PM、Lotto Draw 等。

视频关联规则：

- 用发布时间匹配开奖日期。
- 用标题关键词匹配 drawTime，例如 2PM / 5PM / 9PM。
- 视频不作为号码数据主源，只作为开奖证据和页面内容增强。

## 4. 彩种顺序

前台彩种必须从小到大排列：

1. 2D Lotto
2. 3D Lotto
3. 4D Lotto
4. 6D Lotto
5. Lotto 6/42
6. Mega Lotto 6/45
7. Super Lotto 6/49
8. Grand Lotto 6/55
9. Ultra Lotto 6/58

## 5. 走势图结构

参考 500 基本走势图结构：

- 彩种导航
- 走势类型导航
- 最近 30 / 50 / 100 期
- 自定义期号范围
- 带遗漏数据
- 带折线
- 重号标注
- 日期
- 期号
- 开奖号码
- 按位号码区
- 不分位号码区
- 底部统计行

数字型彩种：

- 2D：第1位、第2位、全位
- 3D：第1位、第2位、第3位、全位
- 4D：第1位、第2位、第3位、第4位、全位
- 6D：第1位至第6位、全位

乐透型彩种：

- 6/42、6/45、6/49、6/55、6/58 先按号码从小到大排序。
- 展示排序第1位至排序第6位。
- 另加不分位区。

## 6. 走势类型

MVP 必须完成：

- 基本走势
- 冷热遗漏
- 当前遗漏
- 出现次数
- 平均遗漏
- 最大遗漏
- 重号标注

第一批扩展：

- 奇偶走势
- 大小走势
- 和值走势
- 跨度走势
- 尾数走势
- 分区走势

第二批扩展：

- 连号走势
- 重号走势
- 质合走势
- 除 3 余数
- AC 值
- 号码对频率
- 组合分布

## 7. 页面结构

核心页面：

- `/`：今日开奖 + 热门走势图入口
- `/results/today`：今日开奖结果
- `/results/[game]`：彩种开奖结果
- `/results/[game]/history`：彩种历史
- `/results/date/[yyyy-mm-dd]`：日期归档
- `/trend/[game]`：基本走势
- `/trend/[game]/basic`：基本走势
- `/trend/[game]/odd-even`：奇偶走势
- `/trend/[game]/big-small`：大小走势
- `/trend/[game]/sum`：和值走势
- `/trend/[game]/span`：跨度走势
- `/trend/[game]/tail`：尾数走势
- `/trend/[game]/zone`：分区走势
- `/statistics/[game]/hot-cold`：冷热号码
- `/statistics/[game]/overdue`：遗漏号码
- `/videos`：官方开奖视频
- `/responsible-gaming`：责任博彩
- `/about`：关于独立数据工具

## 8. SEO 内容模板

Title 示例：

- PCSO Lotto Result Today - Latest Official Draw Results
- 2D Lotto Trend Chart - PCSO EZ2 Results and Omission
- 3D Lotto Result Today 2PM 5PM 9PM
- Lotto 6/42 Trend Chart with Omission and Frequency
- Ultra Lotto 6/58 Result History and Number Trends

页面必须包含：

- H1
- 今日/最近开奖结果
- 走势图
- 历史表格
- FAQ
- 官方来源说明
- 免责声明
- Responsible gaming 链接

## 9. 数据库设计

Game:

- id
- code
- name
- displayOrder
- numberCount
- numberMin
- numberMax
- ordered
- drawDays
- drawTimes
- active

DrawResult:

- id
- gameId
- drawDate
- drawTime
- issue
- numbers
- jackpot
- winners
- sourceUrl
- sourceHash
- status
- createdAt
- updatedAt

TrendSnapshot:

- id
- gameId
- windowSize
- metricType
- payloadJson
- calculatedAt

OfficialVideo:

- id
- youtubeVideoId
- title
- publishedAt
- thumbnailUrl
- url
- matchedDrawDate
- matchedDrawTime
- matchedGameId
- status

SyncJob:

- id
- source
- jobType
- startedAt
- finishedAt
- status
- fetchedRows
- insertedRows
- updatedRows
- errorMessage

AuditLog:

- id
- entityType
- entityId
- action
- beforeJson
- afterJson
- createdBy
- createdAt

## 10. 同步任务设计

官方结果同步：

- 每天 13:55-14:40：2D/3D 2PM 高频检查
- 每天 16:55-17:40：2D/3D 5PM 高频检查
- 每天 20:55-22:00：主期开奖 + 2D/3D 9PM 高频检查
- 高频期：每 2 分钟一次
- 确认数据入库后：改为每 30 分钟一次
- 每天 03:00：回补过去 7 天
- 每周：回补过去 12 个月

幂等规则：

- 唯一键：gameId + drawDate + drawTime。
- 如果号码相同但 jackpot/winners 不同，更新金额字段并记录 audit。
- 如果号码不同，标记 conflict，进入人工复核。

## 11. 运营后台

后台功能：

- 查看同步状态
- 手动触发同步
- 查看异常结果
- 手动修正开奖结果
- 管理 YouTube 视频匹配
- 管理 FAQ 和 SEO 文案
- 管理广告位
- 查看流量和热门彩种

## 12. 监控和告警

必须监控：

- 今日是否有新结果
- 同步任务是否失败
- PCSO 页面是否结构变化
- YouTube feed 是否更新
- 数据是否重复
- 号码是否越界
- 中奖号码数量是否不等于彩种要求
- 页面是否 500
- sitemap 是否生成

告警渠道：

- Email
- Telegram bot
- Slack / Discord webhook

## 13. 技术栈

推荐：

- Next.js
- TypeScript
- PostgreSQL
- Prisma
- Redis
- Tailwind CSS
- SVG/canvas trend chart renderer
- Vercel / Railway / Render
- Cloudflare CDN

采集服务：

- Node.js worker
- Cheerio HTML parser
- Retry + timeout + cache
- User-Agent 管理
- robots / ToS 风险评估

## 14. 变现

第一阶段：

- SEO + AdSense / Ezoic
- 页面广告位：顶部、走势图下方、历史表中间、侧栏、移动端底部

第二阶段：

- 会员去广告
- 自定义期数
- 高级走势
- CSV 导出
- 图片分享
- 收藏号码
- 开奖提醒

第三阶段：

- 数据 API
- Telegram bot
- B2B 数据授权

## 15. 合规文案

页面底部必须显示：

This website is an independent information and statistics platform. It is not affiliated with, endorsed by, or operated by PCSO. We do not sell lottery tickets, accept bets, process wagers, or guarantee winning numbers. All trend charts and statistics are based on historical draw results and are provided for informational reference only. Please play responsibly.

