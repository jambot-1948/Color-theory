export type DEHueId =
  | "ingest"
  | "transform"
  | "orchestrate"
  | "store"
  | "serve"
  | "observe"
  | "govern";

export type Maturity = "emerging" | "production";
export type ComplexityLevel = "low" | "medium" | "high";
export type ContributionLevel = "low" | "medium" | "high";

export interface DESiteMeta {
  name: string;
  version: string;
  tagline: string;
  description: string;
}

export interface DEHue {
  id: DEHueId;
  name: string;
  colorName: string;
  hex: string;
  description: string;
}

export interface DETool {
  id: string;
  name: string;
  primaryHue: DEHueId;
  secondaryHue?: DEHueId;
  category: string;
  maturity: Maturity;
  description: string;
  complexityAdded: ComplexityLevel;
  trustContribution: ContributionLevel;
  pairsWellWith: string[];
  conflictsWith: string[];
  patterns: string[];
  notes: string;
}

export interface DEPattern {
  id: string;
  name: string;
  type: "foundational" | "high-velocity" | "anti-pattern" | "structural";
  hues: DEHueId[];
  description: string;
  strengths: string[];
  weaknesses: string[];
  watchFor: string[];
}

export interface DERecipe {
  id: string;
  name: string;
  tools: string[];
  patternIds: string[];
  useCase: string;
  whyItWorks?: string[];
  whereItBreaks?: string[];
  missingHues?: DEHueId[];
  upgradePath?: string[];
  whyItHappens?: string[];
  symptoms?: string[];
  fix?: string[];
}

export interface DEChromaticsData {
  site: DESiteMeta;
  hues: DEHue[];
  evaluationDimensions: string[];
  tools: DETool[];
  patterns: DEPattern[];
  recipes: DERecipe[];
}

export const dataEngineeringChromaticsData: DEChromaticsData = {
  site: {
    name: "Data Engineering Chromatics",
    version: "0.1",
    tagline: "A landscape of data tools, pipeline patterns, and stack compositions seen through color theory.",
    description:
      "Data Engineering Chromatics is a reference landscape for modern data stacks that treats tools like pigments, pipeline roles like hues, and stack compositions like color harmonies.",
  },

  hues: [
    {
      id: "ingest",
      name: "Ingest",
      colorName: "Burnt Orange",
      hex: "#D9512A",
      description: "Who brings raw data in from the world — connectors, streams, CDC.",
    },
    {
      id: "transform",
      name: "Transform",
      colorName: "Purple",
      hex: "#7A4FA8",
      description: "Who shapes data into meaning — SQL models, distributed computation, enrichment.",
    },
    {
      id: "orchestrate",
      name: "Orchestrate",
      colorName: "Steel Blue",
      hex: "#3A70B8",
      description: "Who sequences and schedules the work — DAGs, asset dependencies, backfills.",
    },
    {
      id: "store",
      name: "Store",
      colorName: "Teal",
      hex: "#2A8A6E",
      description: "Who holds data at rest — warehouses, lakes, table formats.",
    },
    {
      id: "serve",
      name: "Serve",
      colorName: "Amber",
      hex: "#C49A2A",
      description: "Who delivers data to consumers — query engines, semantic layers, metrics APIs.",
    },
    {
      id: "observe",
      name: "Observe",
      colorName: "Rose",
      hex: "#C44B6A",
      description: "Who watches whether data is correct and complete — quality, lineage, anomaly detection.",
    },
    {
      id: "govern",
      name: "Govern",
      colorName: "Indigo",
      hex: "#4A5A9A",
      description: "Who records ownership, catalog, lineage, and access policy across the stack. Engines such as the warehouse enforce access.",
    },
  ],

  evaluationDimensions: [
    "harmony",
    "contrast",
    "complexity",
    "durability",
    "clarity",
    "adaptability",
    "operationalLoad",
    "trustSurface",
  ],

  tools: [
    {
      id: "kafka",
      name: "Apache Kafka",
      primaryHue: "ingest",
      secondaryHue: "store",
      category: "Streaming Platform",
      maturity: "production",
      description:
        "Distributed event streaming platform that keeps a durable, replayable log of events for high-throughput, fault-tolerant pipelines.",
      complexityAdded: "high",
      trustContribution: "medium",
      pairsWellWith: ["spark", "iceberg", "snowflake", "openflow", "datahub"],
      conflictsWith: [],
      patterns: ["kappa-architecture", "lambda-architecture"],
      notes:
        "Kafka 4.0 runs only in KRaft mode, without ZooKeeper, but cluster operation is still significant work. Many teams use a managed service. Often more than batch-only analytical workloads need. Snowflake publishes a Kafka connector, and Apache Iceberg includes a Kafka Connect sink.",
    },
    {
      id: "fivetran",
      name: "Fivetran",
      primaryHue: "ingest",
      category: "Managed ELT",
      maturity: "production",
      description:
        "Managed connector platform for replicating data from SaaS applications and databases into warehouses or data lakes. Reduces the connector code a team maintains.",
      complexityAdded: "low",
      trustContribution: "low",
      pairsWellWith: ["dbt", "snowflake", "iceberg", "dagster", "datahub"],
      conflictsWith: [],
      patterns: ["tiered-refinery"],
      notes:
        "Managed ingestion reduces connector maintenance. The Managed Data Lake Service writes Iceberg and Delta Lake tables to object storage. Fivetran and dbt Labs completed their merger in June 2026; the products continue to run independently for now.",
    },
    {
      id: "openflow",
      name: "Snowflake Openflow",
      primaryHue: "ingest",
      category: "Managed Ingestion",
      maturity: "production",
      description:
        "Snowflake-managed data-integration service, built on Apache NiFi, for ingesting data through configured connectors and runtimes.",
      complexityAdded: "medium",
      trustContribution: "medium",
      pairsWellWith: ["snowflake", "kafka"],
      conflictsWith: [],
      patterns: ["tiered-refinery"],
      notes:
        "Second-generation deployments and runtimes became generally available in September 2026, while gen 2 connector configuration remains in preview and new gen 1 deployments can no longer be created. Check each connector's status and compare coverage with Fivetran per source.",
    },
    {
      id: "dbt",
      name: "dbt",
      primaryHue: "transform",
      secondaryHue: "observe",
      category: "SQL Transformation",
      maturity: "production",
      description:
        "SQL-first transformation framework that treats data models as software — with versioning, testing, documentation, and lineage built in.",
      complexityAdded: "low",
      trustContribution: "high",
      pairsWellWith: ["snowflake", "great-expectations", "dagster", "fivetran", "airflow", "trino", "spark", "cube", "datahub"],
      conflictsWith: [],
      patterns: ["tiered-refinery", "semantic-spine", "observability-first"],
      notes:
        "SQL-first transformation remains a strong fit for warehouse models. dbt v2, built on the Fusion engine, is generally available, and adapters exist for Snowflake, Trino, and Spark. dbt Labs and Fivetran merged in June 2026. Validate project compatibility before upgrading.",
    },
    {
      id: "spark",
      name: "Apache Spark",
      primaryHue: "transform",
      category: "Distributed Processing",
      maturity: "production",
      description:
        "Distributed computation engine for large-scale batch and streaming data transformation at petabyte scale.",
      complexityAdded: "high",
      trustContribution: "low",
      pairsWellWith: ["kafka", "iceberg", "dagster", "dbt", "airflow"],
      conflictsWith: [],
      patterns: ["lambda-architecture", "kappa-architecture"],
      notes:
        "Right for scale-out compute. Overkill for warehouse-based analytical workloads where dbt is simpler and faster to iterate.",
    },
    {
      id: "airflow",
      name: "Apache Airflow",
      primaryHue: "orchestrate",
      category: "Workflow Orchestration",
      maturity: "production",
      description:
        "Widely adopted Python workflow orchestrator built around DAGs, with a large provider ecosystem (including Snowflake and Spark providers).",
      complexityAdded: "medium",
      trustContribution: "low",
      pairsWellWith: ["dbt", "spark", "great-expectations", "snowflake", "datahub"],
      conflictsWith: [],
      patterns: ["tiered-refinery", "lambda-architecture"],
      notes:
        "Airflow 3 (3.3.x as of September 2026) supports asset-aware and event-driven scheduling. Dagster remains an alternative asset-centered orchestrator; using both is a boundary and operations decision, not a tool incompatibility.",
    },
    {
      id: "dagster",
      name: "Dagster",
      primaryHue: "orchestrate",
      secondaryHue: "observe",
      category: "Asset Orchestration",
      maturity: "production",
      description:
        "Asset-based orchestration platform with built-in lineage, observability, and partitioned backfills. Data-aware by design.",
      complexityAdded: "medium",
      trustContribution: "high",
      pairsWellWith: ["dbt", "great-expectations", "spark", "snowflake", "iceberg", "fivetran", "datahub"],
      conflictsWith: [],
      patterns: ["tiered-refinery", "observability-first"],
      notes:
        "Asset-centered orchestration with lineage and backfills. If Airflow is already present, assign clear ownership before adding a second orchestrator.",
    },
    {
      id: "snowflake",
      name: "Snowflake",
      primaryHue: "store",
      secondaryHue: "serve",
      category: "Cloud Data Warehouse",
      maturity: "production",
      description:
        "Cloud data platform with separated storage and compute, supporting both native tables and Apache Iceberg tables.",
      complexityAdded: "low",
      trustContribution: "medium",
      pairsWellWith: ["dbt", "fivetran", "openflow", "kafka", "iceberg", "trino", "cube", "great-expectations", "dagster", "airflow", "datahub"],
      conflictsWith: [],
      patterns: ["tiered-refinery", "semantic-spine"],
      notes:
        "Cloud warehouse with native dbt project execution, Openflow ingestion, and a Kafka connector built on Snowpipe Streaming. Access control is enforced here, not in the catalog. Compare the managed native path with external orchestration and connector platforms for the workload.",
    },
    {
      id: "iceberg",
      name: "Apache Iceberg",
      primaryHue: "store",
      category: "Open Table Format",
      maturity: "production",
      description:
        "Open table format for large analytic datasets with ACID transactions, time travel, and schema evolution on top of object storage.",
      complexityAdded: "medium",
      trustContribution: "medium",
      pairsWellWith: ["spark", "trino", "dagster", "kafka", "snowflake", "fivetran"],
      conflictsWith: [],
      patterns: ["lambda-architecture", "kappa-architecture"],
      notes:
        "A table format, not a storage system: it needs object storage beneath it and engines such as Spark, Trino, or Snowflake to read and write it. Helps reduce engine lock-in.",
    },
    {
      id: "trino",
      name: "Trino",
      primaryHue: "serve",
      category: "Federated Query Engine",
      maturity: "production",
      description:
        "Distributed SQL query engine for federated analytics across data lakes, warehouses, and operational databases without moving data.",
      complexityAdded: "medium",
      trustContribution: "low",
      pairsWellWith: ["snowflake", "iceberg", "dbt", "cube", "datahub"],
      conflictsWith: [],
      patterns: ["semantic-spine"],
      notes:
        "Enables querying data where it lives, including a Snowflake connector. Earns its place when there is lake or operational data to join. Complexity grows with federation scope.",
    },
    {
      id: "cube",
      name: "Cube",
      primaryHue: "serve",
      secondaryHue: "govern",
      category: "Semantic Layer",
      maturity: "production",
      description:
        "Semantic and metrics API layer between the warehouse and consumers. Enforces consistent metric definitions, caches query results, and controls access.",
      complexityAdded: "medium",
      trustContribution: "high",
      pairsWellWith: ["snowflake", "dbt", "trino", "datahub"],
      conflictsWith: [],
      patterns: ["semantic-spine"],
      notes:
        "The answer to 'why does revenue look different in every dashboard?' Cube enforces one definition of a metric and serves it to all consumers. Trino queries raw data; Cube serves governed meaning.",
    },
    {
      id: "great-expectations",
      name: "GX Core",
      primaryHue: "observe",
      category: "Data Quality",
      maturity: "production",
      description:
        "GX Core data-validation framework for defining, running, and documenting expectations at pipeline checkpoints.",
      complexityAdded: "medium",
      trustContribution: "high",
      pairsWellWith: ["dbt", "dagster", "airflow", "snowflake", "datahub"],
      conflictsWith: [],
      patterns: ["observability-first", "tiered-refinery"],
      notes:
        "Most effective when integrated at pipeline boundaries, not bolted on at the end. Expectation authoring is a non-trivial skill.",
    },
    {
      id: "datahub",
      name: "DataHub",
      primaryHue: "govern",
      secondaryHue: "observe",
      category: "Data Catalog",
      maturity: "production",
      description:
        "Metadata platform for discovery, ownership, and lineage across the stack. Access policies are documented here, but the warehouse and query engines enforce them.",
      complexityAdded: "medium",
      trustContribution: "high",
      pairsWellWith: ["snowflake", "dbt", "kafka", "dagster", "airflow", "great-expectations", "cube", "fivetran", "trino"],
      conflictsWith: [],
      patterns: ["observability-first"],
      notes:
        "Works best when fed by existing systems: DataHub has ingestion sources or plugins for Snowflake, dbt, Kafka, Fivetran, Trino, Cube, Airflow, Dagster, and GX. Catalog coverage decays without named owners.",
    },
  ],

  patterns: [
    {
      id: "tiered-refinery",
      name: "The Tiered Refinery",
      type: "foundational",
      hues: ["ingest", "transform", "store", "observe"],
      description:
        "Raw data is noisy, inconsistent, and untrustworthy — but cleaning everything upfront slows ingestion. Serving raw data downstream means every consumer inherits every data quality problem. Promote data through progressive quality gates: raw enters, validated and modeled exits. Each tier has a contract. Reprocess from any tier when something goes wrong.",
      strengths: [
        "Clear promotion criteria and quality contracts",
        "Easy to debug — reprocess from any tier",
        "Replayable and auditable",
      ],
      weaknesses: [
        "Batch by nature — high latency for operational use cases",
        "Gold layer bloat if promotion criteria aren't enforced",
      ],
      watchFor: [
        "Too many purpose-built Gold tables that diverge in definition",
        "Skipping the Silver tier under deadline pressure",
      ],
    },
    {
      id: "lambda-architecture",
      name: "Lambda Architecture",
      type: "structural",
      hues: ["ingest", "transform", "orchestrate", "store", "serve"],
      description:
        "Streaming alone can't economically handle large historical queries. Batch alone can't meet latency requirements for operational decisions. Run parallel paths — streaming for low latency, batch for high throughput — and merge them at the serving layer. The cost is two codebases for the same logic; logic divergence between them is the most common failure mode.",
      strengths: [
        "Addresses both real-time and batch analytical needs",
        "Mature, well-understood pattern",
      ],
      weaknesses: [
        "Two codebases for the same logic — the maintenance burden is real",
        "Logic divergence between batch and stream paths is the most common failure mode",
      ],
      watchFor: [
        "Batch and streaming outputs that disagree with each other",
        "Drift in business logic between the two paths over time",
      ],
    },
    {
      id: "kappa-architecture",
      name: "Kappa Architecture",
      type: "foundational",
      hues: ["ingest", "transform", "store", "serve"],
      description:
        "Lambda's two-codebase problem compounds over time — the same business logic diverges between batch and stream paths. Kappa bets that stream processing is expressive enough to handle everything, including historical reprocessing. One codebase, one processing model. Reprocessing means replaying the stream.",
      strengths: [
        "Single codebase for all processing logic",
        "Lower operational complexity than Lambda",
      ],
      weaknesses: [
        "Reprocessing is harder — requires replaying the full stream",
        "Stateful streaming complexity can erode the simplicity argument",
      ],
      watchFor: [
        "State management that grows more complex than the batch path it replaced",
        "Reprocessing windows that exceed what the event log retains",
      ],
    },
    {
      id: "data-swamp",
      name: "Data Swamp",
      type: "anti-pattern",
      hues: ["ingest", "store"],
      description:
        "Ingest velocity is visible and celebrated. Quality and governance work is invisible and deferred. The lake fills up while downstream usability collapses in silence — data becomes untrustworthy, undiscoverable, and unusable before anyone declares a problem.",
      strengths: [],
      weaknesses: [
        "Data becomes untrustworthy, undiscoverable, and unusable at scale",
        "Technical debt compounds with every new data source added",
      ],
      watchFor: [
        "High ingest velocity with no corresponding Observe or Govern investment",
        "'We'll clean it up later' becoming the permanent strategy",
      ],
    },
    {
      id: "hollow-warehouse",
      name: "Hollow Warehouse",
      type: "anti-pattern",
      hues: ["store", "serve"],
      description:
        "The warehouse is provisioned, connectors are running, dashboards are live. But without a transformation layer, every team queries raw tables and defines the same metrics differently. Revenue has five definitions. Nobody trusts the numbers. The warehouse has data but no agreement on what it means.",
      strengths: ["Fast to stand up initially"],
      weaknesses: [
        "Consumers inherit all data quality issues from upstream",
        "No shared semantic layer means every team redefines the same metrics differently",
      ],
      watchFor: [
        "'Just query the raw table' becoming the standard answer",
        "Multiple teams with conflicting definitions of the same business metric",
      ],
    },
    {
      id: "ungoverned-refinery",
      name: "The Ungoverned Refinery",
      type: "anti-pattern",
      hues: ["observe", "govern"],
      description:
        "The refinery itself is well built: sources load reliably, models are tested, and schedules run. What is absent is the accountability layer. Nobody has recorded who owns each dataset, how columns flow from source to dashboard, or which data is sensitive. Access grew informally in the engines. Observe and Govern are the hues this pattern lacks, and the gap stays invisible until an audit, an incident, or a PII question arrives.",
      strengths: [
        "Transformation and loading are solid, so the fix is additive rather than a rebuild",
      ],
      weaknesses: [
        "Lineage and ownership are unknown, so impact analysis is guesswork",
        "Access roles drift broader than anyone intended",
        "Sensitive data exposure is unmapped",
      ],
      watchFor: [
        "'Who owns this table?' having no written answer",
        "New query paths (federation, new BI tools) widening access without review",
        "Quality relying only on model tests, with no checks at promotion boundaries",
      ],
    },
    {
      id: "semantic-spine",
      name: "Semantic Spine",
      type: "foundational",
      hues: ["transform", "serve", "govern"],
      description:
        "Without a shared semantic layer, business logic lives in every consumer's query. Revenue gets defined differently by product, finance, and sales. Every dashboard is its own source of truth. One semantic layer owns business logic — consumers query meaning, not raw tables. When the definition of revenue changes, it changes once.",
      strengths: [
        "Consistent metric definitions across all consumers",
        "Single source of truth for business logic",
      ],
      weaknesses: [
        "Requires upfront investment in modeling discipline",
        "Can become a bottleneck if the semantic layer is too narrow",
      ],
      watchFor: [
        "Semantic layer that grows too broad and becomes unmaintainable",
        "Teams bypassing the semantic layer under deadline pressure",
      ],
    },
    {
      id: "pipeline-pileup",
      name: "Pipeline Pileup",
      type: "anti-pattern",
      hues: ["orchestrate"],
      description:
        "Airflow was already running when Dagster got adopted by the new team. The custom cron jobs predate both. Each orchestrator owns 'different things' but they trigger each other. Lineage breaks at every system boundary. On-call is a nightmare — failures can originate anywhere and trace nowhere.",
      strengths: [],
      weaknesses: [
        "Lineage breaks at system boundaries",
        "On-call is a nightmare — failures can originate anywhere",
      ],
      watchFor: [
        "Two orchestrators that 'own different things' but trigger each other",
        "Custom cron jobs that exist because the official orchestrator was 'too slow to set up'",
      ],
    },
    {
      id: "observability-first",
      name: "Observability-First",
      type: "high-velocity",
      hues: ["observe", "transform", "orchestrate"],
      description:
        "Adding quality validation slows initial development. Teams defer it as phase two. By the time they realize the data is wrong, consumers have built reports and decisions on top of it. Retrofitting quality gates after the fact is expensive and politically difficult. Wire them in from the start — data must pass before it promotes.",
      strengths: [
        "Catches data quality issues before they reach consumers",
        "Builds trust in downstream reporting",
      ],
      weaknesses: [
        "Slower initial development — expectation authoring takes time",
        "Expectations that are too loose will pass but miss real issues",
      ],
      watchFor: [
        "Expectations that haven't been updated as schema or business logic changed",
        "Quality gates that always pass — a sign they're not checking the right things",
      ],
    },
  ],

  recipes: [
    {
      id: "snowflake-native-stack",
      name: "The Snowflake-Native Stack",
      tools: ["openflow", "snowflake", "dbt", "great-expectations"],
      patternIds: ["tiered-refinery", "observability-first"],
      useCase: "An analytical pipeline that keeps ingestion and dbt execution close to Snowflake, with explicit data validation.",
      whyItWorks: [
        "Openflow supplies managed connector ingestion",
        "Snowflake can run dbt projects natively, with its tasks handling straightforward schedules",
        "GX Core adds validation beyond model-level tests where needed",
      ],
      whereItBreaks: [
        "Check Openflow connector support and deployment requirements for each source",
        "Use an external orchestrator when work crosses systems or native tasks do not cover recovery needs",
        "No catalog records ownership or lineage outside Snowflake",
      ],
      missingHues: ["orchestrate", "govern"],
    },
    {
      id: "modern-data-stack",
      name: "The Modern Data Stack",
      tools: ["fivetran", "dbt", "snowflake", "great-expectations"],
      patternIds: ["tiered-refinery"],
      useCase:
        "Standard analytical stack for a mid-size company. Managed connectors feed a warehouse; SQL models create clean analytical tables.",
      whyItWorks: [
        "Low operational overhead when connector and dbt execution are managed",
        "Fast to stand up and iterate",
        "Fivetran loads Snowflake; dbt transforms and tests warehouse data",
      ],
      whereItBreaks: [
        "Streaming latency is not specified; choose connector sync behavior against freshness needs",
        "Data quality is optional unless you enforce GX Core checks at promotion gates",
        "No catalog: ownership and lineage are undocumented, and access is managed only through warehouse roles",
      ],
      missingHues: ["orchestrate", "govern"],
      upgradePath: [
        "Add Dagster for asset-level orchestration and lineage",
        "Add DataHub to record ownership and lineage; keep access enforced in Snowflake",
      ],
    },
    {
      id: "streaming-pipeline",
      name: "The Streaming Pipeline",
      tools: ["kafka", "spark", "iceberg", "dagster"],
      patternIds: ["kappa-architecture"],
      useCase:
        "Event-driven pipeline for near-real-time data processing and analytics on large-scale event streams.",
      whyItWorks: [
        "Kafka and Spark carry the streaming path into an open table format",
        "Dagster schedules batch work such as maintenance and backfills, and can observe streaming outputs as assets",
        "Iceberg provides snapshots (time travel) and schema evolution",
      ],
      whereItBreaks: [
        "High operational complexity — Kafka and Spark both require cluster management",
        "No serve layer defined — consumers must know where and how to query",
        "Quality checks and governance are not defined; Dagster observes assets but does not validate their contents",
      ],
      missingHues: ["serve", "govern"],
    },
    {
      id: "shadow-pipeline",
      name: "The Shadow Pipeline",
      tools: ["kafka", "airflow", "snowflake"],
      patternIds: ["data-swamp"],
      useCase:
        "Data moves fast. Nobody knows if it's right. The stack looks sophisticated but has no quality or governance layer.",
      whyItHappens: [
        "Velocity was the priority — getting data flowing was the first milestone",
        "Observe and Govern were deferred as 'phase two' and never happened",
      ],
      symptoms: [
        "Dashboards contradict each other depending on which table was queried",
        "Nobody can answer 'where does this number come from?'",
        "Data incidents are discovered by the business, not the data team",
      ],
      fix: [
        "Add GX Core checks at pipeline promotion points",
        "Add DataHub to record ownership and trace lineage from source to dashboard",
        "Add dbt to create a shared transformation layer with documented models",
      ],
      missingHues: ["transform", "observe", "govern"],
    },
    {
      id: "governance-gap",
      name: "The Governance Gap",
      tools: ["fivetran", "dbt", "snowflake", "trino", "airflow"],
      patternIds: ["ungoverned-refinery"],
      useCase:
        "A sophisticated, well-modeled stack with no accountability layer. Transformation is strong; quality relies on model tests alone, and ownership, lineage, and access policy are unrecorded.",
      whyItHappens: [
        "Governance was treated as a compliance problem, not an engineering one",
        "The team was small enough that informal access control worked — until it didn't",
      ],
      symptoms: [
        "Column-level lineage is unknown",
        "Access control is ad hoc — everyone has more access than they need",
        "PII exposure risk that no one has mapped",
      ],
      fix: [
        "Add DataHub for catalog, ownership, lineage, and access policy documentation; tighten roles in Snowflake and Trino",
        "Add GX Core checks as quality gates at Silver-tier promotion",
      ],
      missingHues: ["govern"],
    },
    {
      id: "full-modern-stack",
      name: "The Full Stack",
      tools: ["kafka", "fivetran", "dbt", "dagster", "snowflake", "trino", "great-expectations", "datahub"],
      patternIds: ["tiered-refinery", "observability-first"],
      useCase:
        "Production-grade data platform with at least one tool on each of the 7 hues. Ownership of each responsibility still has to be assigned to people.",
      whyItWorks: [
        "Ingest covered by both batch (Fivetran) and streaming (Kafka) paths",
        "Quality gates (GX Core) and lineage (DataHub, fed by dbt, Dagster, and Snowflake metadata) are planned in, not deferred",
        "Federated query layer (Trino) can reach data outside the warehouse",
      ],
      whereItBreaks: [
        "High team complexity — requires clear ownership and operating capacity",
        "Kafka is the primary operational weight anchor — requires managed infrastructure or dedicated cluster ops",
        "If Airflow is retained alongside Dagster, define which platform owns each schedule and recovery path",
      ],
    },
  ],
};
