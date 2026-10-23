const projects = {
  platform: {
    type: "Data platform modernization",
    period: "Production · udChalo",
    title: "Enterprise Data Platform",
    summary: "Replaced fragmented Lambda-to-CSV reporting with a governed AWS-to-Snowflake platform supporting CDC, incremental transformation, BI and secure delivery.",
    why: "Static D−1 files could not reflect later source changes, support flexible date ranges, or safely serve a growing analytics audience.",
    role: "Designed ingestion and modeling patterns, developed dbt and Airflow workflows, established quality controls, and partnered with analysts on consumption models.",
    outcomes: [["70+", "reports migrated or created"], ["<5 min", "delivery per reporting model"], ["<1%", "annual pipeline failure rate"], ["93%", "lower average query time"], ["80%", "less manual reporting effort"], ["20+", "Metabase dashboards"]],
    tech: ["DynamoDB Streams", "RDS", "S3", "Lambda", "Snowflake", "dbt", "MWAA Airflow", "Metabase", "Cognito"],
    captions: {
      pipeline: "Incremental events and daily extracts land in S3, flow through governed Snowflake layers, then serve reports and BI.",
      architecture: "Storage, transformation, orchestration and access controls are separated so each layer can evolve independently.",
      model: "The logical model preserves source lineage while exposing stable facts and curated reporting marts."
    },
    diagrams: {
      pipeline: flow([["DynamoDB / RDS", "CDC + D−1"], ["S3 data lake", "JSON · CSV"], ["External tables", "Snowflake stage"], ["dbt models", "stg → fct → rpt", true], ["BI + reports", "Metabase · S3"]]),
      architecture: architecture([["Source plane", ["30+ DynamoDB tables", "10+ RDS tables", "APIs · BigQuery · files"]], ["Data plane", ["S3 raw zones", "Snowflake warehouse", "dbt medallion layers"]], ["Control plane", ["MWAA DAGs", "Tests + alerts", "IAM · RBAC · Cognito"]]]),
      model: entities([["source_event", "event_id PK · source · op · event_ts · payload"], ["booking_fact", "booking_id PK · customer_id FK · product_id FK · amount · status"], ["report_mart", "report_key PK · business_date · dimensions · measures"], ["customer_dim", "customer_id PK · segment · valid_from · valid_to"], ["product_dim", "product_id PK · lob · supplier_id FK"], ["supplier_dim", "supplier_id PK · supplier_type · name"]], "source_event 1→N booking_fact · facts N→1 dimensions · report_mart aggregates facts")
    }
  },
  recon: {
    type: "FinOps automation",
    period: "Production · udChalo",
    title: "Automated Reconciliation Platform",
    summary: "Built an in-house, Snowflake-hosted reconciliation system that automatically compares internal bookings with provider and supplier settlements.",
    why: "A third-party Microsoft Dynamics 365 process was expensive and constrained the finance team’s control over matching rules, exceptions and auditability.",
    role: "Modeled multi-source transactions, implemented deterministic and tolerance-based matching, automated exception workflows, and delivered finance-ready outputs.",
    outcomes: [["₹20L", "annual platform cost saved"], ["3+", "payment providers automated"], ["12+", "airline suppliers covered"], ["End-to-end", "scheduled reconciliation"], ["Auditable", "match and exception lineage"], ["Lower risk", "less manual intervention"]],
    tech: ["Snowflake", "SQL", "Python", "dbt", "Airflow", "S3", "APIs", "Data quality"],
    captions: {
      pipeline: "Internal and external transactions are standardized before rules assign matched, unmatched or review-required outcomes.",
      architecture: "A reusable rules layer isolates provider-specific formats from finance reporting and exception management.",
      model: "The match bridge supports one-to-one and grouped reconciliation while retaining both original transaction records."
    },
    diagrams: {
      pipeline: flow([["Internal bookings", "Snowflake facts"], ["Provider feeds", "API · S3 files"], ["Normalize", "currency · IDs · dates"], ["Match engine", "rules + tolerances", true], ["Exceptions", "finance review"], ["Settlement mart", "auditable output"]]),
      architecture: architecture([["Ingestion", ["Payment providers", "Airline suppliers", "Internal bookings"]], ["Reconciliation core", ["Canonical schema", "Matching rules", "Exception states"]], ["Finance access", ["Settlement reports", "Variance dashboard", "Audit trail"]]]),
      model: entities([["internal_txn", "internal_txn_id PK · booking_id · amount · currency"], ["provider_txn", "provider_txn_id PK · provider_id FK · amount · settled_at"], ["recon_match", "match_id PK · rule_id FK · status · variance"], ["match_member", "match_id FK · txn_type · txn_id"], ["match_rule", "rule_id PK · provider_id FK · tolerance · priority"], ["exception", "exception_id PK · match_id FK · owner · resolution"]], "transactions N↔N recon_match through match_member · match_rule 1→N recon_match")
    }
  },
  portal: {
    type: "Data product",
    period: "Production · udChalo",
    title: "Self-Service Reporting Portal",
    summary: "Created a UI-driven reporting experience where authorized users choose a report and business filters, then receive fresh Snowflake-backed data without engineering hand-offs.",
    why: "Teams depended on fixed-period CSVs and recurring analyst requests whenever they needed a custom date range or revised data.",
    role: "Designed the parameterized query layer, report catalog and secure delivery flow; replaced public S3 access with private access governed through Cognito.",
    outcomes: [["Minutes", "to retrieve ad hoc data"], ["Any range", "instead of fixed D−1 files"], ["Private", "report object access"], ["Fewer tickets", "to data teams"], ["Fresh data", "from governed rpt models"], ["Controlled", "user-level access"]],
    tech: ["Streamlit", "Snowflake SQL", "S3", "Cognito", "Python", "RBAC", "dbt marts"],
    captions: {
      pipeline: "A validated user request becomes a parameterized Snowflake query; the result is delivered through a controlled path.",
      architecture: "Identity, application, query and storage concerns are isolated to remove public links and protect warehouse access.",
      model: "Report definitions and permissions drive safe, reusable requests while audit events preserve usage history."
    },
    diagrams: {
      pipeline: flow([["Business user", "selects report"], ["Cognito", "authenticates"], ["Streamlit", "validates filters"], ["Snowflake rpt", "parameterized SQL", true], ["Private S3", "generated result"], ["Secure access", "authorized user"]]),
      architecture: architecture([["Experience", ["Report catalog", "Date + business filters", "Status + download"]], ["Application", ["Streamlit service", "Query templates", "Result generation"]], ["Security + data", ["Cognito users", "Snowflake RBAC", "Private S3 objects"]]]),
      model: entities([["user", "user_id PK · email · status"], ["report_definition", "report_id PK · model_name · allowed_filters"], ["report_permission", "user_id FK · report_id FK · access_level"], ["report_request", "request_id PK · user_id FK · report_id FK · filters"], ["report_result", "result_id PK · request_id FK · object_key · expires_at"], ["audit_event", "event_id PK · request_id FK · action · created_at"]], "user N↔N report_definition through permission · request 1→1 result · request 1→N audit_event")
    }
  },
  search: {
    type: "Scale-ready design case study",
    period: "PySpark · modeled scale",
    title: "Search Intelligence Pipeline at Scale",
    summary: "A future-scale design that extends the search-event pipeline with S3 pointer messaging and a PySpark transformation layer for nested, high-volume supplier results.",
    why: "Lambda is excellent for event capture, but nested search payloads, deduplication, large joins, small-file compaction and a strict batch SLA eventually require distributed processing.",
    role: "Designed the reference architecture, workload assumptions, schema strategy, Spark transformations, partitioning and Snowflake hand-off for a production-ready scale scenario.",
    outcomes: [["50M", "modeled rows per day"], ["~60 GB", "modeled raw JSON per day"], ["3K/s", "modeled peak event rate"], ["<45 min", "target D−1 batch SLA"], ["10–15 GB", "estimated Parquet output"], ["100–250 MB", "target file size"]],
    tech: ["Supplier APIs", "SNS", "SQS + DLQ", "Lambda", "S3", "PySpark", "AWS Glue / EMR Serverless", "Parquet", "Snowflake"],
    captions: {
      pipeline: "Events carry S3 pointers—not large payloads. PySpark reads the immutable raw zone, normalizes results, and writes compact Parquet for Snowflake.",
      architecture: "The control plane coordinates events and retries; the data plane stores and transforms payloads without queue-size coupling.",
      model: "Nested supplier payloads are normalized into a search, itinerary, segment and fare model suitable for route and pricing analytics."
    },
    diagrams: {
      pipeline: flow([["Supplier APIs", "search responses"], ["Lambda capture", "validate + S3 put"], ["SNS → SQS", "S3 pointer only"], ["S3 Bronze", "raw JSON"], ["PySpark", "flatten · dedupe · rank", true], ["S3 Silver", "Snappy Parquet"], ["Snowflake", "COPY + dbt marts"]]) + '<div class="case-note"><strong>Accuracy note:</strong> The scale figures are design assumptions for this case study, not claimed udChalo production traffic. The current daily warehouse workload does not require Spark.</div>',
      architecture: architecture([["Event control plane", ["Lambda capture", "SNS fan-out", "SQS retry + DLQ"]], ["Lake processing plane", ["S3 Bronze JSON", "Glue / EMR PySpark", "S3 Silver Parquet"]], ["Analytics plane", ["Snowflake COPY", "dbt search marts", "Supplier + funnel BI"]]]) + '<div class="case-note">At current low volumes, Snowflake + dbt remains the simpler choice. Spark becomes valuable when distributed transformations, file compaction and SLA pressure justify its operational cost.</div>',
      model: entities([["search_request", "search_id PK · route · travel_date · passengers"], ["supplier_response", "response_id PK · search_id FK · supplier_id FK · latency_ms"], ["itinerary", "itinerary_id PK · response_id FK · stops · duration"], ["segment", "segment_id PK · itinerary_id FK · sequence · flight_no"], ["fare", "fare_id PK · itinerary_id FK · cabin · currency · total_amount"], ["supplier", "supplier_id PK · name · channel · active_flag"]], "search_request 1→N responses · response 1→N itineraries · itinerary 1→N segments and fares")
    }
  },
  calls: {
    type: "AI-enabled operations",
    period: "Production project · udChalo",
    title: "AI Call Intelligence for Lead Prioritization",
    summary: "Ingested MetroLeads recordings, transcribed and scored calls with Gemini on Databricks, and delivered ranked leads to operations teams for faster follow-up.",
    why: "Operations teams needed a consistent way to identify high-intent conversations across housing and flight follow-up calls instead of manually reviewing recordings.",
    role: "Built API ingestion, recording processing, transcript structuring, prompt-based sentiment and intent scoring, and ranked lead delivery.",
    outcomes: [["100+", "calls processed per day"], ["35%", "lead-to-booking uplift"], ["Ranked", "high-intent follow-ups"], ["Automated", "transcription and scoring"], ["Structured", "conversation intelligence"], ["Reusable", "housing + flight use cases"]],
    tech: ["MetroLeads API", "Python", "Databricks", "Google Gemini", "Snowflake", "S3", "Airflow"],
    captions: {
      pipeline: "Recordings are ingested, transcribed and scored before qualified leads are ranked for operations follow-up.",
      architecture: "Raw media, AI processing, structured analytics and the action layer are separated for reprocessing and auditability.",
      model: "Each lead can have multiple calls; every call has a transcript and scored signals that feed a prioritized action."
    },
    diagrams: {
      pipeline: flow([["MetroLeads API", "recordings + leads"], ["S3 raw", "audio + metadata"], ["Databricks", "prepare + transcribe"], ["Gemini", "sentiment + intent", true], ["Snowflake", "scores + ranks"], ["Operations", "priority follow-up"]]),
      architecture: architecture([["Ingestion", ["MetroLeads API", "Scheduled extraction", "Raw audio storage"]], ["Intelligence", ["Databricks processing", "Gemini inference", "Quality + retry checks"]], ["Activation", ["Snowflake lead mart", "Ranked worklist", "Ops follow-up"]]]),
      model: entities([["lead", "lead_id PK · project_type · source · status"], ["call", "call_id PK · lead_id FK · recording_uri · duration"], ["transcript", "transcript_id PK · call_id FK · text · language"], ["ai_score", "score_id PK · transcript_id FK · sentiment · intent · confidence"], ["lead_rank", "rank_id PK · lead_id FK · score · rank_date"], ["follow_up", "action_id PK · lead_id FK · owner · outcome"]], "lead 1→N calls · call 1→1 transcript · transcript 1→N scores · lead 1→N follow-ups")
    }
  }
};

function flow(nodes) {
  return '<div class="flow">' + nodes.map((n, i) => `${i ? '<span class="flow-arrow" aria-hidden="true">→</span>' : ''}<div class="flow-node ${n[2] ? 'accent' : ''}">${n[0]}<small>${n[1]}</small></div>`).join('') + '</div>';
}

function architecture(layers) {
  return '<div class="architecture-map">' + layers.map(layer => `<section class="arch-layer"><h4>${layer[0]}</h4><div>${layer[1].map(item => `<p>${item}</p>`).join('')}</div></section>`).join('') + '</div>';
}

function entities(items, relation) {
  return '<div class="entity-map">' + items.map(item => `<section class="entity"><h4>${item[0]}</h4><p>${item[1]}</p></section>`).join('') + `<div class="relation">${relation}</div></div>`;
}

let activeProject = 'platform';
let activeView = 'pipeline';

function renderProject() {
  const p = projects[activeProject];
  document.getElementById('project-type').textContent = p.type;
  document.getElementById('project-period').textContent = p.period;
  document.getElementById('project-title').textContent = p.title;
  document.getElementById('project-summary').textContent = p.summary;
  document.getElementById('project-why').textContent = p.why;
  document.getElementById('project-role').textContent = p.role;
  document.getElementById('project-outcomes').innerHTML = p.outcomes.map(o => `<div class="outcome"><strong>${o[0]}</strong><span>${o[1]}</span></div>`).join('');
  document.getElementById('diagram-canvas').innerHTML = p.diagrams[activeView];
  document.getElementById('diagram-caption').textContent = p.captions[activeView];
  document.getElementById('project-tech').innerHTML = p.tech.map(t => `<span>${t}</span>`).join('');
}

document.querySelectorAll('.project-choice').forEach(button => {
  button.addEventListener('click', () => {
    activeProject = button.dataset.project;
    activeView = 'pipeline';
    document.querySelectorAll('.project-choice').forEach(b => {
      b.classList.toggle('active', b === button);
      b.setAttribute('aria-selected', b === button ? 'true' : 'false');
    });
    document.querySelectorAll('.diagram-tab').forEach(b => {
      const selected = b.dataset.view === 'pipeline';
      b.classList.toggle('active', selected);
      b.setAttribute('aria-selected', selected ? 'true' : 'false');
    });
    renderProject();
  });
});

document.querySelectorAll('.diagram-tab').forEach(button => {
  button.addEventListener('click', () => {
    activeView = button.dataset.view;
    document.querySelectorAll('.diagram-tab').forEach(b => {
      b.classList.toggle('active', b === button);
      b.setAttribute('aria-selected', b === button ? 'true' : 'false');
    });
    renderProject();
  });
});

const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.site-nav');
menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: .08 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

renderProject();
