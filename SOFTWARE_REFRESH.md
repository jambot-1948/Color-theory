# Software and Combination Refresh

Reviewed September 24, 2026. This is a capability and combination audit, not a recommendation to upgrade installed software. No application dependencies or production integrations were changed.

## Changes

- Added OpenAI Agents SDK and a lean knowledge-agent recipe. The SDK owns tools, handoffs, sessions, guardrails, and tracing; a Pinecone retrieval tool is an integration the application must implement, not a built-in connection.
- Added Snowflake Openflow and a Snowflake-native ingestion recipe. Openflow gen 2 deployments and runtimes are generally available; connector coverage and deployment requirements still need checking per source.
- Updated dbt, Airflow, GX Core, Snowflake, Fivetran, Redis, and LangChain/LangGraph descriptions to reflect current capabilities. Removed blanket incompatibilities for Kafka/Fivetran, dbt/Spark, Airflow/Dagster, Redis/PostgreSQL, Lambda/Kubernetes, and LangGraph/Temporal. Their responsibilities can still overlap in a *specific design*.
- Corrected recipe claims that equated document retrieval with conversation memory, assumed Redis always loses data on restart, or promised full safety and visibility.

## Official References

- [OpenAI Agents SDK](https://openai.github.io/openai-agents-python/) and [tracing behavior](https://openai.github.io/openai-agents-python/tracing/)
- [LangChain and LangGraph learning guides](https://docs.langchain.com/oss/python/learn)
- [Snowflake Openflow gen 2 release](https://docs.snowflake.com/en/release-notes/2026/other/2026-09-08-openflow-gen2-deployment-runtime-ga), [Openflow gen 2 deployments](https://docs.snowflake.com/en/user-guide/data-integration/openflow/gen2/index), and [dbt Projects on Snowflake](https://docs.snowflake.com/en/user-guide/data-engineering/dbt-projects-on-snowflake)
- [dbt Developer Hub](https://docs.getdbt.com/) and [dbt platform version guidance](https://docs.getdbt.com/docs/dbt-versions/upgrade-dbt-platform-version)
- [Airflow asset-aware scheduling](https://airflow.apache.org/docs/apache-airflow/stable/authoring-and-scheduling/asset-scheduling.html) and [event-driven scheduling](https://airflow.apache.org/docs/apache-airflow/stable/authoring-and-scheduling/event-scheduling.html)
- [Fivetran event connectors](https://fivetran.com/docs/connectors/events) and [Kafka destination](https://fivetran.com/docs/destinations/apache-kafka)
- [Redis persistence options](https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/)
- [GX Core overview](https://docs.greatexpectations.io/docs/core/introduction/gx_overview/)
- [OpenTelemetry semantic conventions](https://opentelemetry.io/docs/specs/semconv/)

## Still Needs Design Review

- Vendor documentation confirms capabilities, not whether a given pairing is economical, operationally appropriate, or secure for a particular team.
- The non-AI recipes still use generic explanatory steps. They need authored integration points, ownership, and failure paths before the diagrams can be treated as technical build instructions.
- Tool-level `pairsWellWith` remains a curated editorial judgment. It is not a compatibility certification or a data-flow arrow.
