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
      description: "Who controls access, catalog, and compliance across the stack.",
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
      secondaryHue: "orchestrate",
      category: "Streaming Platform",
      maturity: "production",
      description:
        "Distributed event streaming platform for high-throughput, fault-tolerant data pipelines. The backbone of event-driven architectures.",
      complexityAdded: "high",
      trustContribution: "medium",
      pairsWellWith: ["spark", "dagster", "iceberg"],
      conflictsWith: ["fivetran"],
      patterns: ["kappa-architecture", "lambda-architecture"],
      notes:
        "High operational overhead. Consider managed Kafka (Confluent, MSK) for most teams. Overkill for batch-only analytical workloads.",
    },
    {
      id: "fivetran",
      name: "Fivetran",
      primaryHue: "ingest",
      category: "Managed ELT",
      maturity: "production",
      description:
        "Managed connector platform for replicating data from SaaS sources into a data warehouse. Eliminates connector maintenance.",
      complexityAdded: "low",
      trustContribution: "low",
      pairsWellWith: ["dbt", "snowflake", "great-expectations"],
      conflictsWith: ["kafka"],
      patterns: ["tiered-refinery"],
      notes:
        "Solves the connector problem but adds vendor dependency. No streaming support — batch replication only.",
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
      pairsWellWith: ["snowflake", "great-expectations", "dagster", "fivetran"],
      conflictsWith: ["spark"],
      patterns: ["tiered-refinery", "semantic-spine", "observability-first"],
      notes:
        "De facto standard for warehouse-based transformation. The built-in test framework gives it a foothold in the Observe hue.",
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
      pairsWellWith: ["kafka", "iceberg", "dagster"],
      conflictsWith: ["dbt"],
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
        "Python-based workflow scheduler built around DAGs. The original data pipeline orchestrator with a large ecosystem.",
      complexityAdded: "medium",
      trustContribution: "low",
      pairsWellWith: ["dbt", "spark", "great-expectations"],
      conflictsWith: ["dagster"],
      patterns: ["tiered-refinery", "lambda-architecture"],
      notes:
        "Mature and widely deployed. Lacks asset-level lineage and native data awareness — it knows about tasks, not tables.",
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
      pairsWellWith: ["dbt", "great-expectations", "spark", "snowflake"],
      conflictsWith: ["airflow"],
      patterns: ["tiered-refinery", "observability-first"],
      notes:
        "Higher learning curve than Airflow but the asset model changes the operational and debugging experience fundamentally.",
    },
    {
      id: "snowflake",
      name: "Snowflake",
      primaryHue: "store",
      secondaryHue: "serve",
      category: "Cloud Data Warehouse",
      maturity: "production",
      description:
        "Cloud-native data warehouse with compute/storage separation, near-zero maintenance, and strong SQL compatibility.",
      complexityAdded: "low",
      trustContribution: "medium",
      pairsWellWith: ["dbt", "fivetran", "trino", "great-expectations", "dagster"],
      conflictsWith: [],
      patterns: ["tiered-refinery", "semantic-spine"],
      notes:
        "Default choice for analytical workloads. High storage cost at scale. Compute/storage separation makes it easier to reason about costs.",
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
      pairsWellWith: ["spark", "trino", "dagster"],
      conflictsWith: [],
      patterns: ["lambda-architecture", "kappa-architecture"],
      notes:
        "Not a storage system — needs S3/GCS/HDFS beneath it. Pairs with compute engines. The open-format bet against warehouse lock-in.",
    },
    {
      id: "trino",
      name: "Trino",
      primaryHue: "serve",
      category: "Query Engine",
      maturity: "production",
      description:
        "Distributed SQL query engine for federated analytics across data lakes, warehouses, and operational databases without moving data.",
      complexityAdded: "medium",
      trustContribution: "low",
      pairsWellWith: ["snowflake", "iceberg", "datahub"],
      conflictsWith: [],
      patterns: ["semantic-spine"],
      notes:
        "Enables querying data where it lives. Complexity scales with federation scope — simple federation is easy, complex federation is hard.",
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
      name: "Great Expectations",
      primaryHue: "observe",
      category: "Data Quality",
      maturity: "production",
      description:
        "Data quality framework for defining, testing, and documenting expectations about data at pipeline checkpoints.",
      complexityAdded: "medium",
      trustContribution: "high",
      pairsWellWith: ["dbt", "dagster", "airflow", "snowflake"],
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
        "Metadata platform for data discovery, lineage tracking, and governance across the full stack.",
      complexityAdded: "medium",
      trustContribution: "high",
      pairsWellWith: ["snowflake", "dbt", "kafka", "dagster"],
      conflictsWith: [],
      patterns: ["observability-first"],
      notes:
        "Works best wired into existing orchestration and transformation outputs — not as a standalone catalog. Governance as engineering.",
    },
  ],

  patterns: [
    {
      id: "tiered-refinery",
      name: "The Tiered Refinery",
      type: "foundational",
      hues: ["ingest", "transform", "store", "observe"],
      description:
        "Data promoted through progressive quality tiers. Each tier is a gate — raw data enters, validated and modeled data exits.",
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
        "Parallel batch and streaming paths that merge at the serving layer. Handles both latency and throughput requirements.",
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
        "Stream-first architecture that eliminates the batch path. All data is treated as an event stream; batch is just slow streaming.",
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
        "Data lands in storage with no transformation, quality validation, or governance. Volume grows; usability collapses.",
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
        "A warehouse with data flowing in and queries going out, but no transformation or quality layer. Raw data is served directly.",
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
      id: "semantic-spine",
      name: "Semantic Spine",
      type: "foundational",
      hues: ["transform", "serve", "govern"],
      description:
        "A strong metrics and semantic layer sits between storage and consumers. Business logic lives in one place; consumers query meaning, not data.",
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
        "Multiple orchestration systems in the same stack — Airflow, Dagster, and custom scripts all triggering each other.",
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
        "Quality gates are woven into the pipeline from the start. Data must pass validation before promotion to the next tier.",
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
      id: "modern-data-stack",
      name: "The Modern Data Stack",
      tools: ["fivetran", "dbt", "snowflake", "great-expectations"],
      patternIds: ["tiered-refinery"],
      useCase:
        "Standard analytical stack for a mid-size company. Managed connectors feed a warehouse; SQL models create clean analytical tables.",
      whyItWorks: [
        "Low operational overhead — all three core tools are managed or low-infra",
        "Fast to stand up and iterate",
        "Strong ecosystem integrations (Fivetran → dbt → Snowflake is well-worn)",
      ],
      whereItBreaks: [
        "No streaming — all batch replication",
        "Data quality is optional unless you enforce Great Expectations at promotion gates",
        "No governance layer — access control and lineage are manual",
      ],
      missingHues: ["orchestrate", "govern"],
      upgradePath: [
        "Add Dagster for asset-level orchestration and lineage",
        "Add DataHub for catalog and access governance",
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
        "End-to-end streaming with an open table format",
        "Dagster provides asset-level observability across the pipeline",
        "Iceberg enables time travel and schema evolution without rewriting",
      ],
      whereItBreaks: [
        "High operational complexity — Kafka and Spark both require cluster management",
        "No serve layer defined — consumers must know where and how to query",
        "No quality validation or governance",
      ],
      missingHues: ["serve", "observe", "govern"],
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
        "Add Great Expectations at pipeline promotion points",
        "Add DataHub to trace lineage from source to dashboard",
        "Add dbt to create a shared transformation layer with documented models",
      ],
      missingHues: ["transform", "observe", "govern"],
    },
    {
      id: "governance-gap",
      name: "The Governance Gap",
      tools: ["fivetran", "dbt", "snowflake", "trino", "airflow"],
      patternIds: ["hollow-warehouse"],
      useCase:
        "A sophisticated, well-modeled stack with no accountability layer. Strong transformation, silent on quality and access.",
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
        "Add DataHub for catalog, lineage, and access policy documentation",
        "Add Great Expectations for quality gates at Silver-tier promotion",
      ],
      missingHues: ["observe", "govern"],
    },
    {
      id: "full-modern-stack",
      name: "The Full Stack",
      tools: ["kafka", "fivetran", "dbt", "dagster", "snowflake", "trino", "great-expectations", "datahub"],
      patternIds: ["tiered-refinery", "observability-first"],
      useCase:
        "Production-grade data platform covering all 7 hues. Every architectural responsibility has an owner.",
      whyItWorks: [
        "Ingest covered by both batch (Fivetran) and streaming (Kafka) paths",
        "Quality gates (Great Expectations) and lineage (DataHub via Dagster) are first-class",
        "Open serving layer (Trino) decoupled from the warehouse",
      ],
      whereItBreaks: [
        "High team complexity — requires dedicated data platform engineering to operate",
        "Kafka is the primary operational weight anchor — requires managed infrastructure or dedicated cluster ops",
        "Teams with existing Airflow will be tempted to retain it alongside Dagster — resist; pick one orchestrator",
      ],
    },
  ],
};
