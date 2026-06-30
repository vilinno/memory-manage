import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity,
  AlertTriangle,
  Archive,
  BarChart3,
  Bot,
  Braces,
  CheckCircle2,
  CircleGauge,
  Clock3,
  Database,
  Eye,
  FileJson,
  Filter,
  GitBranch,
  GitMerge,
  KeyRound,
  Layers3,
  MessageSquareText,
  Network,
  Play,
  Search,
  ServerCog,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Tags,
  Trash2,
  WandSparkles,
} from "lucide-react";
import "./styles.css";

const navItems = [
  { id: "overview", label: "工作台", icon: CircleGauge },
  { id: "access", label: "接入配置", icon: KeyRound },
  { id: "memories", label: "标准记忆单元", icon: Database },
  { id: "fusion", label: "抽取与融合审核", icon: GitMerge },
  { id: "retrieval", label: "多信号检索台", icon: Search },
  { id: "context", label: "上下文装配预览", icon: FileJson },
  { id: "audit", label: "日志与监控", icon: Activity },
];

const kpis = [
  { label: "标准化记忆单元", value: "128,420", delta: "mem0 存取底座", icon: Database, tone: "teal" },
  { label: "今日治理通过率", value: "94.6%", delta: "抽取 / 融合 / 审核", icon: CheckCircle2, tone: "green" },
  { label: "检索 P90", value: "412ms", delta: "search 底座 + 重排", icon: Clock3, tone: "amber" },
  { label: "待人工确认", value: "286", delta: "冲突 / 待验证 / 敏感", icon: AlertTriangle, tone: "red" },
];

const agents = [
  { name: "生产线排产智能体", id: "agent-prod-schedule", scene: "制造 / SMT", key: "ak_live_9f2...31c", qps: 8.2, status: "启用" },
  { name: "办公协同智能体", id: "agent-office-copilot", scene: "行政 / 项目管理", key: "ak_live_4cc...8da", qps: 5.7, status: "启用" },
  { name: "财务报销智能体", id: "agent-finance-expense", scene: "财经", key: "ak_test_2ab...914", qps: 1.9, status: "测试" },
];

const pipeline = [
  { label: "写入接收", value: "18,240", detail: "mem0 /memories + 企业元数据", status: "正常" },
  { label: "抽取任务", value: "2,184", detail: "infer 链路与本地模型提示词优化", status: "积压 42" },
  { label: "去重融合", value: "764", detail: "相似匹配、版本关系、融合策略", status: "待审 86" },
  { label: "状态治理", value: "286", detail: "待验证、冲突、冷归档、强制遗忘", status: "需人工" },
  { label: "检索调度", value: "24,916", detail: "mem0 search + 多信号排序解释", status: "P90 412ms" },
  { label: "上下文装配", value: "9,420", detail: "JSON / Prompt 双格式与 token 预算", status: "成功率 97.2%" },
];

const memories = [
  {
    id: "MEM-20260629-0018",
    layer: "用户级",
    type: "偏好型记忆",
    content: "用户偏好正式、严谨、适合立项书的技术方案表达。",
    summary: "长期文风偏好：正式严谨、适合项目申报材料。",
    user: "u-1024",
    userName: "项目申报负责人",
    agent: "办公协同智能体",
    agentId: "agent-office-copilot",
    scene: "项目管理",
    sceneId: "project-management",
    session: "S-8291",
    task: "task-proposal-71",
    entities: ["立项书", "技术方案", "表达风格"],
    keywords: ["正式", "严谨", "立项书"],
    confidence: 0.94,
    importance: 0.91,
    recency: "2026-06-29 10:18",
    status: "有效",
    permission: "项目管理域可访问",
    relation: "稳定偏好，无冲突版本",
    source: "会话 S-8291 第 12 轮",
  },
  {
    id: "MEM-20260629-0019",
    layer: "任务级",
    type: "任务型记忆",
    content: "当前记忆系统项目处于白板阶段，前端需先完成管理后台原型。",
    summary: "任务状态：前端先完成管理后台原型。",
    user: "u-1024",
    userName: "前端工作组成员",
    agent: "办公协同智能体",
    agentId: "agent-office-copilot",
    scene: "项目管理",
    sceneId: "project-management",
    session: "S-8302",
    task: "task-memory-ui",
    entities: ["记忆系统", "前端原型", "管理后台"],
    keywords: ["白板阶段", "原型", "前端"],
    confidence: 0.91,
    importance: 0.88,
    recency: "2026-06-30 11:20",
    status: "待验证",
    permission: "前端工作组可访问",
    relation: "需要与后端记忆单元字段对齐",
    source: "会话 S-8302 第 4 轮",
  },
  {
    id: "MEM-20260629-0020",
    layer: "系统级",
    type: "事实型记忆",
    content: "系统采用 B/S 管理后台 + 标准化 API 网关形态。",
    summary: "系统形态：B/S 管理后台与标准化 API 网关。",
    user: "admin",
    userName: "系统管理员",
    agent: "系统设计智能体",
    agentId: "agent-design",
    scene: "平台建设",
    sceneId: "platform",
    session: "DOC-001",
    task: "task-architecture",
    entities: ["B/S管理后台", "API网关", "HTTP RESTful API"],
    keywords: ["B/S", "API网关", "管理后台"],
    confidence: 0.98,
    importance: 0.93,
    recency: "2026-06-29 15:10",
    status: "有效",
    permission: "平台建设域可访问",
    relation: "来自设计文档，作为架构约束",
    source: "设计文档 89-91 段",
  },
  {
    id: "MEM-20260629-0021",
    layer: "会话级",
    type: "反馈型记忆",
    content: "相似偏好记忆存在新旧表述差异，需要人工确认是否覆盖。",
    summary: "融合冲突：新旧偏好表述存在差异。",
    user: "u-7788",
    userName: "客服运营",
    agent: "客服智能体",
    agentId: "agent-cs",
    scene: "客户服务",
    sceneId: "customer-service",
    session: "S-9120",
    task: "task-cs-448",
    entities: ["用户偏好", "冲突覆盖", "人工确认"],
    keywords: ["冲突", "覆盖", "偏好"],
    confidence: 0.68,
    importance: 0.73,
    recency: "2026-06-30 09:42",
    status: "冲突",
    permission: "客服域 + 审核员可访问",
    relation: "疑似替代 MEM-20260618-0007",
    source: "融合任务 F-1309",
  },
];

const retrievalResults = [
  { rank: 1, memory: memories[1], score: 0.93, semantic: 0.91, keyword: 0.84, entity: 0.88, recency: 0.96, reason: "任务ID命中 + 语义相关 + 时间新近" },
  { rank: 2, memory: memories[0], score: 0.88, semantic: 0.86, keyword: 0.72, entity: 0.81, recency: 0.79, reason: "用户偏好命中 + 场景匹配" },
  { rank: 3, memory: memories[2], score: 0.81, semantic: 0.76, keyword: 0.92, entity: 0.74, recency: 0.68, reason: "关键词：B/S、API网关、管理后台" },
  { rank: 4, memory: memories[3], score: 0.62, semantic: 0.66, keyword: 0.58, entity: 0.63, recency: 0.86, reason: "存在冲突状态，进入候选但降权" },
];

const fusionTasks = [
  {
    id: "F-1309",
    status: "冲突待审",
    input: "用户说之后的方案说明更偏正式一点，别太口语化。",
    candidate: "用户偏好正式、严谨、适合立项书的技术方案表达。",
    matched: "用户偏好清晰简洁、少用口语表达。",
    score: 0.84,
    strategy: "人工确认后合并为长期偏好，并记录替代关系。",
    action: "建议合并",
  },
  {
    id: "F-1310",
    status: "可自动跳过",
    input: "好的，收到，谢谢。",
    candidate: "无长期保存价值的寒暄确认。",
    matched: "无",
    score: 0.21,
    strategy: "低价值过滤，不进入长期记忆，仅保留原始日志。",
    action: "跳过写入",
  },
  {
    id: "F-1311",
    status: "待验证",
    input: "当前原型需要把 mem0 search 作为底座，而不是重做检索服务。",
    candidate: "mem0 search 作为基础召回能力，系统负责多信号重排和解释。",
    matched: "系统采用 mem0 作为记忆基座。",
    score: 0.76,
    strategy: "补充已有架构记忆，并生成版本关系。",
    action: "建议融合",
  },
];

const logs = [
  { time: "10:42:31", api: "/api/v1/memory/search", caller: "agent-office-copilot", status: 200, latency: "386ms" },
  { time: "10:42:18", api: "/api/v1/memory/context", caller: "agent-prod-schedule", status: 200, latency: "421ms" },
  { time: "10:41:52", api: "/api/v1/memory/async_write", caller: "agent-finance-expense", status: 202, latency: "74ms" },
  { time: "10:41:13", api: "/api/v1/memory/update", caller: "admin-console", status: 409, latency: "128ms" },
];

function App() {
  const [active, setActive] = useState("overview");
  const [selectedMemory, setSelectedMemory] = useState(memories[1]);
  const [query, setQuery] = useState("继续做记忆系统前端原型，需要沿用哪些项目约束？");
  const ActiveIcon = navItems.find((item) => item.id === active)?.icon ?? CircleGauge;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><Network size={22} /></div>
          <div>
            <strong>记忆治理中台</strong>
            <span>Mem0 Extension Console</span>
          </div>
        </div>
        <nav>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.id} className={active === item.id ? "nav active" : "nav"} onClick={() => setActive(item.id)}>
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="side-card">
          <ShieldCheck size={18} />
          <div>
            <b>原型主线</b>
            <p>mem0 负责基础存取，我们负责企业分类、治理、融合、调度和可解释装配</p>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <div className="crumb"><ActiveIcon size={16} /> {navItems.find((item) => item.id === active)?.label}</div>
            <h1>基于 mem0 扩展的企业级记忆治理原型</h1>
          </div>
          <div className="health-strip">
            <StatusDot label="mem0 API" ok />
            <StatusDot label="向量库" ok />
            <StatusDot label="抽取治理" warn />
          </div>
        </header>

        {active === "overview" && <Overview setActive={setActive} />}
        {active === "access" && <AccessConfig />}
        {active === "memories" && <MemoryManager selectedMemory={selectedMemory} setSelectedMemory={setSelectedMemory} />}
        {active === "fusion" && <FusionReview />}
        {active === "retrieval" && <RetrievalLab query={query} setQuery={setQuery} />}
        {active === "context" && <ContextPreview />}
        {active === "audit" && <AuditMonitor />}
      </main>
    </div>
  );
}

function StatusDot({ label, ok, warn }) {
  return (
    <span className={warn ? "status-dot warn" : ok ? "status-dot ok" : "status-dot"}>
      <i />{label}
    </span>
  );
}

function Overview({ setActive }) {
  return (
    <section className="page-grid">
      <div className="kpi-grid">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <article className={`kpi ${kpi.tone}`} key={kpi.label}>
              <Icon size={20} />
              <span>{kpi.label}</span>
              <strong>{kpi.value}</strong>
              <small>{kpi.delta}</small>
            </article>
          );
        })}
      </div>

      <section className="panel wide">
        <PanelTitle icon={BarChart3} title="记忆治理链路驾驶舱" action="最近 24 小时" />
        <div className="chart">
          {[42, 58, 51, 66, 74, 69, 82, 77, 88, 93, 86, 91].map((value, index) => (
            <span key={index} style={{ height: `${value}%` }} data-tip={`${index * 2}:00-${index * 2 + 2}:00 · 写入 ${Math.round(value * 18)} · 空结果 ${index === 5 ? "7.2%" : "3.8%"}`} />
          ))}
        </div>
        <div className="metric-row">
          <Metric label="写入请求" value="18,240" />
          <Metric label="抽取任务积压" value="42" />
          <Metric label="融合待审" value="86" />
          <Metric label="空结果比例" value="3.8%" />
        </div>
      </section>

      <section className="panel wide">
        <PanelTitle icon={GitMerge} title="mem0 底座之上的企业治理层" action="组内评审主线" />
        <div className="pipeline">
          {pipeline.map((item, index) => (
            <button key={item.label} onClick={() => setActive(index === 1 || index === 2 || index === 3 ? "fusion" : index === 4 ? "retrieval" : index === 5 ? "context" : "access")}>
              <span className="pipeline-index">{index + 1}</span>
              <strong>{item.label}</strong>
              <b>{item.value}</b>
              <small>{item.detail}</small>
              <em>{item.status}</em>
            </button>
          ))}
        </div>
      </section>

      <section className="panel wide">
        <PanelTitle icon={Database} title="最新待处理记忆" action="支持标注 / 失效 / 归档 / 强制遗忘" />
        <MemoryTable compact />
      </section>
    </section>
  );
}

function AccessConfig() {
  return (
    <section className="two-column">
      <section className="panel">
        <PanelTitle icon={Bot} title="智能体接入配置" action="mem0 + 企业元数据" />
        <div className="agent-list">
          {agents.map((agent) => (
            <article className="agent-card" key={agent.id}>
              <div>
                <b>{agent.name}</b>
                <code>{agent.id}</code>
              </div>
              <span className={agent.status === "启用" ? "chip green" : "chip amber"}>{agent.status}</span>
              <p>{agent.scene}</p>
              <div className="agent-meta">
                <span><KeyRound size={14} /> {agent.key}</span>
                <span>{agent.qps} QPS</span>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="panel">
        <PanelTitle icon={Settings2} title="接入字段与 mem0 映射" />
        <FormPreview fields={["user_id", "agent_id", "scene_id", "session_id", "task_id", "timestamp", "messages[]", "metadata{}"]} />
        <div className="checklist">
          <span><CheckCircle2 size={15} /> mem0 POST /memories 作为写入底座</span>
          <span><CheckCircle2 size={15} /> 企业元数据进入 metadata 扩展字段</span>
          <span><CheckCircle2 size={15} /> user / scene / task 多维隔离</span>
          <span><AlertTriangle size={15} /> infer=true 本地抽取链路需治理补强</span>
        </div>
      </section>
    </section>
  );
}

function MemoryManager({ selectedMemory, setSelectedMemory }) {
  return (
    <section className="two-column memory-layout">
      <section className="panel">
        <PanelTitle icon={Database} title="标准化记忆单元管理" action="结构化字段 + 原始内容 + 向量 + 关系" />
        <div className="toolbar">
          <button><Layers3 size={16} /> 层级</button>
          <button><Filter size={16} /> 场景</button>
          <button><Tags size={16} /> 类型</button>
          <button><SlidersHorizontal size={16} /> 状态</button>
          <div className="searchbox"><Search size={15} /> 搜索内容 / 用户 / 任务</div>
        </div>
        <MemoryTable onSelect={setSelectedMemory} selectedId={selectedMemory.id} />
      </section>
      <section className="panel detail-panel">
        <PanelTitle icon={Eye} title="记忆详情与人工干预" />
        <div className="memory-detail">
          <span className={`chip ${statusTone(selectedMemory.status)}`}>{selectedMemory.status}</span>
          <h2>{selectedMemory.summary}</h2>
          <p>{selectedMemory.content}</p>
          <dl>
            <div><dt>层级</dt><dd>{selectedMemory.layer}</dd></div>
            <div><dt>类型</dt><dd>{selectedMemory.type}</dd></div>
            <div><dt>来源</dt><dd>{selectedMemory.source}</dd></div>
            <div><dt>置信度</dt><dd>{selectedMemory.confidence}</dd></div>
            <div><dt>重要性</dt><dd>{selectedMemory.importance}</dd></div>
            <div><dt>实体标签</dt><dd>{selectedMemory.entities.join(" / ")}</dd></div>
            <div><dt>任务</dt><dd>{selectedMemory.task}</dd></div>
            <div><dt>权限</dt><dd>{selectedMemory.permission}</dd></div>
            <div><dt>关系</dt><dd>{selectedMemory.relation}</dd></div>
          </dl>
          <div className="action-row">
            <button><CheckCircle2 size={16} /> 标记有效</button>
            <button><GitBranch size={16} /> 查看版本链</button>
            <button><Archive size={16} /> 冷归档</button>
            <button className="danger"><Trash2 size={16} /> 强制遗忘</button>
          </div>
        </div>
      </section>
    </section>
  );
}

function FusionReview() {
  return (
    <section className="page-grid">
      <section className="panel wide">
        <PanelTitle icon={WandSparkles} title="抽取与融合审核队列" action="补齐 mem0 自动抽取之外的企业治理层" />
        <div className="fusion-grid">
          {fusionTasks.map((task) => (
            <article className="fusion-card" key={task.id}>
              <div className="fusion-head">
                <strong>{task.id}</strong>
                <span className={`chip ${task.status.includes("冲突") ? "red" : task.status.includes("跳过") ? "green" : "amber"}`}>{task.status}</span>
              </div>
              <label>原始输入</label>
              <p>{task.input}</p>
              <label>候选记忆</label>
              <p>{task.candidate}</p>
              <label>匹配历史</label>
              <p>{task.matched}</p>
              <div className="fusion-meta">
                <Metric label="相似度" value={task.score} />
                <Metric label="处理策略" value={task.action} />
              </div>
              <small>{task.strategy}</small>
              <div className="action-row">
                <button><GitMerge size={16} /> 合并</button>
                <button><CheckCircle2 size={16} /> 确认为新记忆</button>
                <button><Archive size={16} /> 跳过</button>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="panel">
        <PanelTitle icon={AlertTriangle} title="当前治理重点" />
        <Metric label="infer=true 空结果" value="需提示词/模型链路优化" />
        <Metric label="冲突来源" value="偏好更新、任务状态变化" />
        <Metric label="人工审核目标" value="提升置信度与可追溯性" />
      </section>
      <section className="panel">
        <PanelTitle icon={GitBranch} title="融合记录需要保留" />
        <div className="checklist">
          <span><CheckCircle2 size={15} /> 匹配到的历史记忆编号</span>
          <span><CheckCircle2 size={15} /> 匹配分数和标识校验</span>
          <span><CheckCircle2 size={15} /> 更新前后内容对比</span>
          <span><CheckCircle2 size={15} /> 状态变化和操作时间</span>
        </div>
      </section>
    </section>
  );
}

function RetrievalLab({ query, setQuery }) {
  const json = useMemo(() => ({
    query,
    user_id: "u-1024",
    scene_id: "project-management",
    task_id: "task-memory-ui",
    top_k: 5,
    filters: ["有效", "待验证"],
    ranking_weights: {
      semantic: 0.35,
      keyword: 0.2,
      entity: 0.2,
      recency: 0.15,
      governance: 0.1,
    },
  }), [query]);

  return (
    <section className="two-column retrieval-layout">
      <section className="panel">
        <PanelTitle icon={Search} title="多信号检索测试台" action="mem0 search 底座 + 企业重排" />
        <label className="field">
          当前问题
          <textarea value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <div className="form-grid">
          <FormInput label="用户ID" value="u-1024" />
          <FormInput label="场景ID" value="project-management" />
          <FormInput label="任务ID" value="task-memory-ui" />
          <FormInput label="Top-K" value="5" />
          <FormInput label="状态过滤" value="有效 / 待验证" />
          <FormInput label="降权策略" value="冲突 / 过期 / 低置信度" />
        </div>
        <pre className="code-block">{JSON.stringify(json, null, 2)}</pre>
        <button className="primary"><Play size={16} /> 运行 mock 检索</button>
      </section>
      <section className="panel">
        <PanelTitle icon={Sparkles} title="Top-K 结果与排序解释" />
        <div className="result-list">
          {retrievalResults.map((result) => (
            <article className="result-card" key={result.rank}>
              <strong>#{result.rank} · {result.memory.type}</strong>
              <p>{result.memory.content}</p>
              <ScoreBars result={result} />
              <div><span>综合分 {result.score}</span><span>{result.reason}</span></div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

function ScoreBars({ result }) {
  return (
    <div className="score-bars">
      {[
        ["语义", result.semantic],
        ["关键词", result.keyword],
        ["实体", result.entity],
        ["时间", result.recency],
      ].map(([label, value]) => (
        <span key={label}>
          <em>{label}</em>
          <i style={{ width: `${value * 100}%` }} />
          <b>{value}</b>
        </span>
      ))}
    </div>
  );
}

function ContextPreview() {
  const prompt = `【用户偏好】\n- 用户偏好正式、严谨、适合立项书的技术方案表达。\n\n【关键事实】\n- 系统采用 B/S 管理后台 + 标准化 API 网关形态。\n\n【任务状态】\n- 当前处于白板阶段，前端需先完成管理后台原型。`;
  return (
    <section className="page-grid">
      <section className="panel">
        <PanelTitle icon={Braces} title="结构化 JSON 返回" action="/api/v1/memory/context" />
        <pre className="code-block tall">{JSON.stringify({ format: "json", length_limit: 1200, memories: retrievalResults.map((r) => ({ type: r.memory.type, content: r.memory.content, score: r.score, source: r.memory.source })) }, null, 2)}</pre>
      </section>
      <section className="panel">
        <PanelTitle icon={MessageSquareText} title="Prompt 上下文片段" action="可直接注入" />
        <div className="prompt-preview">{prompt}</div>
        <div className="metric-row">
          <Metric label="上下文长度" value="248 tokens" />
          <Metric label="裁剪策略" value="按价值" />
          <Metric label="分组方式" value="类型" />
        </div>
      </section>
      <section className="panel wide">
        <PanelTitle icon={SlidersHorizontal} title="上下文预算与装配决策" action="避免过量注入与关键缺失" />
        <div className="budget-row">
          <Budget label="系统提示词" value={18} />
          <Budget label="当前输入" value={12} />
          <Budget label="已选记忆" value={26} />
          <Budget label="输出预留" value={28} />
          <Budget label="剩余" value={16} muted />
        </div>
        <div className="assembly-grid">
          <Decision title="入选记忆" items={["任务状态 MEM-0019：直接支撑当前原型工作", "用户偏好 MEM-0018：影响评审表达风格", "事实记忆 MEM-0020：约束系统形态"]} />
          <Decision title="淘汰/降权记忆" items={["冲突记忆 MEM-0021：状态为冲突，仅保留提示", "低价值寒暄：不进入长期记忆", "旧版本偏好：被新记忆替代"]} />
          <Decision title="一致性检查" items={["按状态排除已删除/已过期", "按任务和场景防止误召回", "冲突记忆进入警示，不直接注入"]} />
        </div>
      </section>
    </section>
  );
}

function Budget({ label, value, muted }) {
  return (
    <div className={muted ? "budget muted" : "budget"}>
      <span>{label}</span>
      <i style={{ width: `${value}%` }} />
      <strong>{value}%</strong>
    </div>
  );
}

function Decision({ title, items }) {
  return (
    <article className="decision-card">
      <strong>{title}</strong>
      {items.map((item) => <span key={item}><CheckCircle2 size={14} /> {item}</span>)}
    </article>
  );
}

function AuditMonitor() {
  return (
    <section className="page-grid">
      <section className="panel wide">
        <PanelTitle icon={Activity} title="接口调用日志" action="审计追踪" />
        <table className="data-table">
          <thead><tr><th>时间</th><th>接口</th><th>调用方</th><th>状态</th><th>耗时</th></tr></thead>
          <tbody>
            {logs.map((log) => (
              <tr key={`${log.time}-${log.api}`}>
                <td>{log.time}</td>
                <td><code>{log.api}</code></td>
                <td>{log.caller}</td>
                <td><span className={log.status >= 400 ? "chip red" : "chip green"}>{log.status}</span></td>
                <td>{log.latency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className="panel">
        <PanelTitle icon={ServerCog} title="资源运行监控" />
        <Metric label="CPU" value="42%" />
        <Metric label="数据库连接" value="38 / 120" />
        <Metric label="向量库查询耗时" value="156ms" />
        <Metric label="服务异常次数" value="3" />
      </section>
      <section className="panel">
        <PanelTitle icon={AlertTriangle} title="质量监控" />
        <Metric label="Top-5 召回率" value="87.4%" />
        <Metric label="记忆生成 F1" value="86.2%" />
        <Metric label="关键记忆保留率" value="92.1%" />
        <Metric label="infer 空结果比例" value="3.8%" />
      </section>
    </section>
  );
}

function MemoryTable({ onSelect, selectedId, compact }) {
  return (
    <table className="data-table memory-table">
      <thead>
        <tr><th>记忆内容</th><th>层级 / 类型</th><th>场景</th><th>置信度</th><th>状态</th></tr>
      </thead>
      <tbody>
        {memories.map((memory) => (
          <tr key={memory.id} className={selectedId === memory.id ? "selected" : ""} onClick={() => onSelect?.(memory)}>
            <td>
              <b>{memory.id}</b>
              <span>{compact ? memory.content.slice(0, 34) + "..." : memory.content}</span>
            </td>
            <td>{memory.layer}<br /><small>{memory.type}</small></td>
            <td>{memory.scene}</td>
            <td>{memory.confidence}</td>
            <td><span className={`chip ${statusTone(memory.status)}`}>{memory.status}</span></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function statusTone(status) {
  return status === "有效" ? "green" : status === "冲突" ? "red" : "amber";
}

function PanelTitle({ icon: Icon, title, action }) {
  return (
    <div className="panel-title">
      <div><Icon size={18} /><h2>{title}</h2></div>
      {action && <span>{action}</span>}
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function FormInput({ label, value }) {
  return (
    <label className="field">
      {label}
      <input value={value} readOnly />
    </label>
  );
}

function FormPreview({ fields }) {
  return (
    <div className="field-tags">
      {fields.map((field) => <code key={field}>{field}</code>)}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
