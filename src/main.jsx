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
  ChevronRight,
  CircleGauge,
  Clock3,
  Database,
  Eye,
  FileJson,
  Filter,
  KeyRound,
  Layers3,
  ListChecks,
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
} from "lucide-react";
import "./styles.css";

const navItems = [
  { id: "overview", label: "工作台", icon: CircleGauge },
  { id: "access", label: "接入配置", icon: KeyRound },
  { id: "memories", label: "记忆管理", icon: Database },
  { id: "retrieval", label: "检索测试台", icon: Search },
  { id: "context", label: "上下文预览", icon: FileJson },
  { id: "audit", label: "日志与监控", icon: Activity },
];

const kpis = [
  { label: "结构化记忆", value: "128,420", delta: "+12.8%", icon: Database, tone: "teal" },
  { label: "今日写入成功率", value: "99.36%", delta: "1s avg", icon: CheckCircle2, tone: "green" },
  { label: "检索 P90", value: "412ms", delta: "目标 <500ms", icon: Clock3, tone: "amber" },
  { label: "待人工确认", value: "286", delta: "冲突/待验证", icon: AlertTriangle, tone: "red" },
];

const agents = [
  { name: "生产线排产智能体", id: "agent-prod-schedule", scene: "制造 / SMT", key: "ak_live_9f2...31c", qps: 8.2, status: "启用" },
  { name: "办公协同智能体", id: "agent-office-copilot", scene: "行政 / 项目管理", key: "ak_live_4cc...8da", qps: 5.7, status: "启用" },
  { name: "财务报销智能体", id: "agent-finance-expense", scene: "财经", key: "ak_test_2ab...914", qps: 1.9, status: "测试" },
];

const memories = [
  {
    id: "MEM-20260629-0018",
    type: "用户偏好",
    content: "用户偏好正式、严谨、适合立项书的技术方案表达。",
    user: "u-1024",
    agent: "办公协同智能体",
    scene: "项目管理",
    task: "task-proposal-71",
    confidence: 0.94,
    importance: "高",
    status: "有效",
    source: "会话 S-8291 第 12 轮",
  },
  {
    id: "MEM-20260629-0019",
    type: "任务状态",
    content: "当前记忆系统项目处于白板阶段，前端需先完成管理后台原型。",
    user: "u-1024",
    agent: "办公协同智能体",
    scene: "项目管理",
    task: "task-memory-ui",
    confidence: 0.91,
    importance: "高",
    status: "待验证",
    source: "会话 S-8302 第 4 轮",
  },
  {
    id: "MEM-20260629-0020",
    type: "关键事实",
    content: "系统采用 B/S 管理后台 + 标准化 API 网关形态。",
    user: "admin",
    agent: "系统设计智能体",
    scene: "平台建设",
    task: "task-architecture",
    confidence: 0.98,
    importance: "高",
    status: "有效",
    source: "设计文档 6.3",
  },
  {
    id: "MEM-20260629-0021",
    type: "反馈修正",
    content: "相似偏好记忆存在新旧表述差异，需要人工确认是否覆盖。",
    user: "u-7788",
    agent: "客服智能体",
    scene: "客户服务",
    task: "task-cs-448",
    confidence: 0.68,
    importance: "中",
    status: "冲突",
    source: "融合任务 F-1309",
  },
];

const retrievalResults = [
  { rank: 1, memory: memories[1], score: 0.93, reason: "任务ID命中 + 语义相关 + 时间新近" },
  { rank: 2, memory: memories[0], score: 0.88, reason: "用户偏好命中 + 场景匹配" },
  { rank: 3, memory: memories[2], score: 0.81, reason: "关键词：B/S、API网关、管理后台" },
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
            <strong>记忆中台</strong>
            <span>MemoryOps Console</span>
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
            <b>企业内网环境</b>
            <p>Token 鉴权 · 场景隔离 · 审计开启</p>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <div className="crumb"><ActiveIcon size={16} /> {navItems.find((item) => item.id === active)?.label}</div>
            <h1>面向大模型智能体的记忆管理后台原型</h1>
          </div>
          <div className="health-strip">
            <StatusDot label="API 网关" ok />
            <StatusDot label="向量库" ok />
            <StatusDot label="抽取队列" warn />
          </div>
        </header>

        {active === "overview" && <Overview setActive={setActive} />}
        {active === "access" && <AccessConfig />}
        {active === "memories" && <MemoryManager selectedMemory={selectedMemory} setSelectedMemory={setSelectedMemory} />}
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
        <PanelTitle icon={BarChart3} title="记忆服务运行概览" action="最近 24 小时" />
        <div className="chart">
          {[42, 58, 51, 66, 74, 69, 82, 77, 88, 93, 86, 91].map((value, index) => (
            <span key={index} style={{ height: `${value}%` }} />
          ))}
        </div>
        <div className="metric-row">
          <Metric label="写入请求" value="18,240" />
          <Metric label="检索请求" value="24,916" />
          <Metric label="空结果比例" value="3.8%" />
          <Metric label="抽取任务积压" value="42" />
        </div>
      </section>

      <section className="panel">
        <PanelTitle icon={ListChecks} title="前端应覆盖的核心工作" />
        <div className="task-list">
          {["智能体/场景/API Key 接入配置", "记忆单元查询、详情、状态干预", "检索参数调试与排序解释", "JSON 与 Prompt 上下文预览", "调用日志、性能指标、审计追踪"].map((item) => (
            <button key={item} onClick={() => setActive(item.includes("检索") ? "retrieval" : item.includes("上下文") ? "context" : item.includes("日志") ? "audit" : "memories")}>
              <CheckCircle2 size={16} />
              <span>{item}</span>
              <ChevronRight size={16} />
            </button>
          ))}
        </div>
      </section>

      <section className="panel wide">
        <PanelTitle icon={Database} title="最新待处理记忆" action="支持标注 / 失效 / 归档" />
        <MemoryTable compact />
      </section>
    </section>
  );
}

function AccessConfig() {
  return (
    <section className="two-column">
      <section className="panel">
        <PanelTitle icon={Bot} title="智能体接入配置" action="Mock" />
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
        <PanelTitle icon={Settings2} title="接入字段校验" />
        <FormPreview fields={["user_id", "agent_id", "scene_id", "session_id", "task_id", "timestamp", "messages[]", "metadata{}"]} />
        <div className="checklist">
          <span><CheckCircle2 size={15} /> 必填字段校验</span>
          <span><CheckCircle2 size={15} /> 标识一致性校验</span>
          <span><CheckCircle2 size={15} /> 时间格式标准化</span>
          <span><AlertTriangle size={15} /> 缺失元数据补全</span>
        </div>
      </section>
    </section>
  );
}

function MemoryManager({ selectedMemory, setSelectedMemory }) {
  return (
    <section className="two-column memory-layout">
      <section className="panel">
        <PanelTitle icon={Database} title="记忆单元管理" action="4 条 mock 记录" />
        <div className="toolbar">
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
          <h2>{selectedMemory.content}</h2>
          <dl>
            <div><dt>类型</dt><dd>{selectedMemory.type}</dd></div>
            <div><dt>来源</dt><dd>{selectedMemory.source}</dd></div>
            <div><dt>置信度</dt><dd>{selectedMemory.confidence}</dd></div>
            <div><dt>重要性</dt><dd>{selectedMemory.importance}</dd></div>
            <div><dt>任务</dt><dd>{selectedMemory.task}</dd></div>
          </dl>
          <div className="action-row">
            <button><CheckCircle2 size={16} /> 标记有效</button>
            <button><Archive size={16} /> 冷归档</button>
            <button className="danger"><Trash2 size={16} /> 强制遗忘</button>
          </div>
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
  }), [query]);

  return (
    <section className="two-column retrieval-layout">
      <section className="panel">
        <PanelTitle icon={Search} title="混合检索测试台" action="/api/v1/memory/search" />
        <label className="field">
          当前问题
          <textarea value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <div className="form-grid">
          <FormInput label="用户ID" value="u-1024" />
          <FormInput label="场景ID" value="project-management" />
          <FormInput label="任务ID" value="task-memory-ui" />
          <FormInput label="Top-K" value="5" />
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
              <div><span>相关性 {result.score}</span><span>{result.reason}</span></div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

function ContextPreview() {
  const prompt = `【用户偏好】\n- 用户偏好正式、严谨、适合立项书的技术方案表达。\n\n【关键事实】\n- 系统采用 B/S 管理后台 + 标准化 API 网关形态。\n\n【任务状态】\n- 当前处于白板阶段，前端需先完成管理后台原型。`;
  return (
    <section className="two-column">
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
    </section>
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
        <Metric label="空结果比例" value="3.8%" />
      </section>
    </section>
  );
}

function MemoryTable({ onSelect, selectedId, compact }) {
  return (
    <table className="data-table memory-table">
      <thead>
        <tr><th>记忆内容</th><th>类型</th><th>场景</th><th>置信度</th><th>状态</th></tr>
      </thead>
      <tbody>
        {memories.map((memory) => (
          <tr key={memory.id} className={selectedId === memory.id ? "selected" : ""} onClick={() => onSelect?.(memory)}>
            <td>
              <b>{memory.id}</b>
              <span>{compact ? memory.content.slice(0, 34) + "..." : memory.content}</span>
            </td>
            <td>{memory.type}</td>
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
