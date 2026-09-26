import type { AssemblyStory } from './assemblyStories'

// Authored step stories for the data-engineering recipes. Steps follow each recipe's tool order.
// Arrows between steps mean presentation order, not execution order or data flow.
export const dataStories: Record<string, AssemblyStory> = {
  'snowflake-native-stack': {
    recipeId: 'snowflake-native-stack',
    steps: [
      { toolId: 'openflow', action: 'Bring sources in', explanation: 'Configure Openflow connectors into Snowflake. Check each connector’s status and deployment requirements first; gen 2 connector configuration is still in preview.' },
      { toolId: 'snowflake', action: 'Land and store', explanation: 'Raw data lands in Snowflake tables, which become the base tier of the refinery.' },
      { toolId: 'dbt', action: 'Model in place', explanation: 'Run the dbt project natively in Snowflake, with tasks for straightforward schedules. Cross-system recovery may still need an external orchestrator.' },
      { toolId: 'great-expectations', action: 'Gate promotion', explanation: 'Add GX Core checks where dbt tests are not enough, and decide whether a failure blocks promotion or only alerts.' },
    ],
    links: [
      { first: 'openflow', second: 'snowflake', kind: 'fit', note: 'Openflow is Snowflake’s own integration service and loads into Snowflake tables.' },
      { first: 'snowflake', second: 'dbt', kind: 'fit', note: 'Snowflake can run dbt projects natively; an external dbt deployment also works.' },
      { first: 'dbt', second: 'great-expectations', kind: 'fit', note: 'Curated pairing: dbt tests cover models, and GX Core adds checks at promotion boundaries. Decide which layer owns each check.' },
    ],
  },
  'modern-data-stack': {
    recipeId: 'modern-data-stack',
    steps: [
      { toolId: 'fivetran', action: 'Replicate sources', explanation: 'Managed connectors load SaaS and database data. Choose sync frequency against how fresh consumers need the data.' },
      { toolId: 'dbt', action: 'Shape the models', explanation: 'SQL models turn raw tables into staged and modeled layers, with tests alongside them.' },
      { toolId: 'snowflake', action: 'Store and serve', explanation: 'The warehouse holds every tier and answers queries from BI tools.' },
      { toolId: 'great-expectations', action: 'Add quality gates', explanation: 'Validate data at promotion points. Scheduling and governance are still unassigned in this recipe.' },
    ],
    links: [
      { first: 'fivetran', second: 'snowflake', kind: 'fit', note: 'Snowflake is a supported Fivetran destination.' },
      { first: 'fivetran', second: 'dbt', kind: 'fit', note: 'Fivetran loads tables into the warehouse, and dbt models them from there.' },
      { first: 'dbt', second: 'snowflake', kind: 'fit', note: 'dbt models and tests run against Snowflake through its adapter.' },
      { first: 'dbt', second: 'great-expectations', kind: 'fit', note: 'Curated pairing: split checks between dbt tests and GX Core deliberately so they do not duplicate or leave gaps.' },
    ],
  },
  'streaming-pipeline': {
    recipeId: 'streaming-pipeline',
    steps: [
      { toolId: 'kafka', action: 'Capture events', explanation: 'Topics hold an ordered, replayable event log. Retention sets how far back you can reprocess.' },
      { toolId: 'spark', action: 'Process the stream', explanation: 'Spark streaming jobs transform events. Reprocessing means replaying from Kafka, within its retention.' },
      { toolId: 'iceberg', action: 'Commit to open tables', explanation: 'Results land in Iceberg tables on object storage, with snapshots and schema evolution.' },
      { toolId: 'dagster', action: 'Coordinate the batch edges', explanation: 'Dagster runs table maintenance and backfills and can observe streaming outputs as assets. It does not run the continuous stream itself.' },
    ],
    links: [
      { first: 'kafka', second: 'spark', kind: 'fit', note: 'Spark can read Kafka topics as a streaming source.' },
      { first: 'spark', second: 'iceberg', kind: 'fit', note: 'Spark reads and writes Iceberg tables.' },
      { first: 'kafka', second: 'iceberg', kind: 'fit', note: 'Apache Iceberg also ships a Kafka Connect sink; choose one write path per table.' },
      { first: 'iceberg', second: 'dagster', kind: 'fit', note: 'dagster-iceberg is a community-maintained integration, currently in preview.' },
    ],
  },
  'shadow-pipeline': {
    recipeId: 'shadow-pipeline',
    steps: [
      { toolId: 'kafka', action: 'Move data fast', explanation: 'Events flow quickly, and throughput becomes the milestone everyone watches.' },
      { toolId: 'airflow', action: 'Schedule loads', explanation: 'DAGs push data into the warehouse on time. Nothing in the recipe checks whether it is right.' },
      { toolId: 'snowflake', action: 'Accumulate tables', explanation: 'Tables multiply without shared models, checks, or a catalog. Transform, Observe, and Govern are the missing parts.' },
    ],
    links: [
      { first: 'kafka', second: 'snowflake', kind: 'fit', note: 'Snowflake publishes a Kafka connector. Moving data in is not the problem here; knowing whether it is correct is.' },
      { first: 'airflow', second: 'snowflake', kind: 'fit', note: 'Airflow has a Snowflake provider. On-time loads are not the same as correct data.' },
      { first: 'kafka', second: 'airflow', kind: 'recipe', note: 'Combined in this cautionary recipe; neither part validates or documents what it moves.' },
    ],
  },
  'governance-gap': {
    recipeId: 'governance-gap',
    steps: [
      { toolId: 'fivetran', action: 'Replicate sources', explanation: 'Connectors load data reliably, including columns nobody has classified.' },
      { toolId: 'dbt', action: 'Model well', explanation: 'Models and tests are solid, but their lineage is not published anywhere others can find it.' },
      { toolId: 'snowflake', action: 'Store everything', explanation: 'Access roles grew informally and may be broader than anyone intended.' },
      { toolId: 'trino', action: 'Widen query access', explanation: 'Federation lets more people query more systems, which widens exposure that has not been mapped.' },
      { toolId: 'airflow', action: 'Schedule it all', explanation: 'Runs are dependable, but no part records who owns each dataset or who may see it.' },
    ],
    links: [
      { first: 'fivetran', second: 'dbt', kind: 'fit', note: 'The load-then-model hand-off works; the gap is elsewhere.' },
      { first: 'dbt', second: 'snowflake', kind: 'fit', note: 'Models run well against the warehouse. Ownership of those models is not recorded.' },
      { first: 'trino', second: 'snowflake', kind: 'fit', note: 'Trino has a Snowflake connector. In this design it adds a query path without a matching access review.' },
      { first: 'airflow', second: 'dbt', kind: 'fit', note: 'Airflow can run dbt projects, for example through Astronomer Cosmos.' },
    ],
  },
  'full-modern-stack': {
    recipeId: 'full-modern-stack',
    steps: [
      { toolId: 'kafka', action: 'Stream events', explanation: 'The low-latency path for event sources. Plan for managed infrastructure or dedicated cluster operations.' },
      { toolId: 'fivetran', action: 'Replicate batch sources', explanation: 'Managed connectors for SaaS applications and databases.' },
      { toolId: 'dbt', action: 'Model the refinery', explanation: 'Tiered SQL models with tests at each layer.' },
      { toolId: 'dagster', action: 'Orchestrate assets', explanation: 'One orchestrator owns schedules, backfills, and asset lineage. Adding a second is a boundary decision to make explicitly.' },
      { toolId: 'snowflake', action: 'Store the tiers', explanation: 'The warehouse holds the modeled layers and enforces access.' },
      { toolId: 'trino', action: 'Open query access', explanation: 'Federated SQL across the warehouse and other sources, for consumers outside the BI path.' },
      { toolId: 'great-expectations', action: 'Gate promotion', explanation: 'GX Core checks decide what moves from one tier to the next.' },
      { toolId: 'datahub', action: 'Catalog and trace', explanation: 'Collect metadata, ownership, and lineage from dbt, Dagster, and Snowflake. Access is still enforced in the engines.' },
    ],
    links: [
      { first: 'kafka', second: 'snowflake', kind: 'fit', note: 'Snowflake’s Kafka connector loads topics into tables.' },
      { first: 'fivetran', second: 'snowflake', kind: 'fit', note: 'Snowflake is a supported Fivetran destination.' },
      { first: 'dbt', second: 'dagster', kind: 'fit', note: 'dagster-dbt represents dbt models as Dagster assets.' },
      { first: 'dagster', second: 'snowflake', kind: 'fit', note: 'dagster-snowflake provides Snowflake resources for assets.' },
      { first: 'trino', second: 'snowflake', kind: 'fit', note: 'Trino’s Snowflake connector lets federated queries reach warehouse tables.' },
      { first: 'great-expectations', second: 'datahub', kind: 'fit', note: 'DataHub’s GX plugin can publish validation results as assertions.' },
      { first: 'datahub', second: 'dagster', kind: 'fit', note: 'DataHub’s Dagster plugin captures pipeline lineage.' },
    ],
  },
}
