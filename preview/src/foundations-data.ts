export type FDHueId =
  | "experience"
  | "service"
  | "data"
  | "trust"
  | "delivery"
  | "platform"
  | "operations";

export type FDMaturity = "emerging" | "production";
export type FDComplexityLevel = "low" | "medium" | "high";
export type FDContributionLevel = "low" | "medium" | "high";

export interface FDSiteMeta {
  name: string;
  version: string;
  tagline: string;
  description: string;
}

export interface FDHue {
  id: FDHueId;
  name: string;
  colorName: string;
  hex: string;
  description: string;
}

export interface FDTool {
  id: string;
  name: string;
  primaryHue: FDHueId;
  secondaryHue?: FDHueId;
  category: string;
  maturity: FDMaturity;
  description: string;
  complexityAdded: FDComplexityLevel;
  trustContribution: FDContributionLevel;
  pairsWellWith: string[];
  conflictsWith: string[];
  patterns: string[];
  notes: string;
}

export interface FDPattern {
  id: string;
  name: string;
  type: "foundational" | "high-velocity" | "anti-pattern" | "structural";
  hues: FDHueId[];
  description: string;
  strengths: string[];
  weaknesses: string[];
  watchFor: string[];
}

export interface FDRecipe {
  id: string;
  name: string;
  tools: string[];
  patternIds: string[];
  useCase: string;
  whyItWorks?: string[];
  whereItBreaks?: string[];
  missingHues?: FDHueId[];
  upgradePath?: string[];
  whyItHappens?: string[];
  symptoms?: string[];
  fix?: string[];
}

export interface FDChromaticsData {
  site: FDSiteMeta;
  hues: FDHue[];
  evaluationDimensions: string[];
  tools: FDTool[];
  patterns: FDPattern[];
  recipes: FDRecipe[];
}

// Product claims reviewed September 26, 2026 against official documentation and official GitHub repositories.
// pairsWellWith records documented integrations (official SDKs, drivers, providers, operators, or docs), declared on both tools.
// It is a curated affinity, not a compatibility certification or a data-flow arrow.
export const foundationsData: FDChromaticsData = {
  site: {
    name: "Foundations Chromatics",
    version: "0.1",
    tagline:
      "A framework for the application and delivery foundation that AI and data systems sit on.",
    description:
      "Foundations Chromatics is a reference guide to the general application stack underneath AI and data work: what people use, the services behind it, where data lives, who may do what, how changes ship, where it all runs, and how the team knows it is working. Focus: not any one model or pipeline, but the ordinary foundation they depend on.",
  },

  hues: [
    {
      id: "experience",
      name: "Experience",
      colorName: "Ochre",
      hex: "#D9A441",
      description: "What people see and use: the web and mobile front ends of the application.",
    },
    {
      id: "service",
      name: "Service",
      colorName: "Steel Blue",
      hex: "#3E7CB1",
      description: "The back end: APIs and the business logic that answers the front end and other systems.",
    },
    {
      id: "data",
      name: "Data",
      colorName: "Jade",
      hex: "#2E8B6F",
      description: "Where application state lives and moves: databases, caches, and message queues.",
    },
    {
      id: "trust",
      name: "Trust",
      colorName: "Violet",
      hex: "#5B4B9A",
      description:
        "Who may do what and what you ship: identity and login, secrets, and supply-chain checks such as base images, vulnerability scanning, and SBOMs.",
    },
    {
      id: "delivery",
      name: "Delivery",
      colorName: "Brick Red",
      hex: "#C7573B",
      description:
        "How changes reach production: version control, CI/CD, the artifact registry, and GitOps.",
    },
    {
      id: "platform",
      name: "Platform",
      colorName: "Slate",
      hex: "#4F6D7A",
      description:
        "Where it runs: managed platforms, containers, orchestration, infrastructure as code, and the cloud underneath.",
    },
    {
      id: "operations",
      name: "Operations",
      colorName: "Raspberry",
      hex: "#C2477A",
      description:
        "How the team knows it is working: telemetry, logs, metrics, dashboards, alerting, and SLOs.",
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
    // ── Experience ─────────────────────────────────────────────────────
    {
      id: "nextjs",
      name: "Next.js",
      primaryHue: "experience",
      secondaryHue: "service",
      category: "Web Framework",
      maturity: "production",
      description:
        "React framework for building web applications, with server-side rendering and server-side route handlers alongside the front end. Runs on Node.js.",
      complexityAdded: "medium",
      trustContribution: "low",
      pairsWellWith: ["nodejs", "auth0", "opentelemetry"],
      conflictsWith: [],
      patterns: ["observable-service"],
      notes:
        "Server-side code makes it partly a back end, so decide which logic belongs in Next.js and which in a separate service. Requires Node.js (20.9 or later at the time of review). Documents OpenTelemetry instrumentation; Auth0 publishes a Next.js SDK. Developed by Vercel; MIT-licensed.",
    },
    {
      id: "react-native",
      name: "React Native",
      primaryHue: "experience",
      category: "Mobile Framework",
      maturity: "production",
      description:
        "Framework for building native Android and iOS apps, and other platforms, using React.",
      complexityAdded: "medium",
      trustContribution: "low",
      pairsWellWith: ["auth0"],
      conflictsWith: [],
      patterns: [],
      notes:
        "Brings app-store releases and device-specific testing with it; a mobile client does not remove the need for a back end. Auth0 publishes a React Native SDK. Maintained by Meta and the community; MIT-licensed.",
    },

    // ── Service ────────────────────────────────────────────────────────
    {
      id: "nodejs",
      name: "Node.js",
      primaryHue: "service",
      category: "Runtime",
      maturity: "production",
      description:
        "Open-source, cross-platform JavaScript runtime for servers, APIs, and tooling.",
      complexityAdded: "low",
      trustContribution: "low",
      pairsWellWith: ["nextjs", "postgresql", "redis", "rabbitmq", "auth0", "opentelemetry", "docker", "heroku"],
      conflictsWith: [],
      patterns: ["twelve-factor", "observable-service"],
      notes:
        "A runtime, not a framework: routing, validation, and structure are choices the team makes. The OpenTelemetry JavaScript SDK offers Node.js auto-instrumentation; Redis publishes node-redis; the RabbitMQ tutorials include Node.js; there is an official Node.js Docker image and a Heroku Node.js buildpack. Supported by the OpenJS Foundation; MIT-licensed.",
    },
    {
      id: "django",
      name: "Django",
      primaryHue: "service",
      category: "Web Framework",
      maturity: "production",
      description:
        "Python web framework with an ORM, migrations, authentication, and an admin interface included.",
      complexityAdded: "low",
      trustContribution: "medium",
      pairsWellWith: ["postgresql", "redis", "opentelemetry", "heroku"],
      conflictsWith: [],
      patterns: ["twelve-factor", "observable-service"],
      notes:
        "Batteries included, so many early decisions are already made. PostgreSQL is an officially supported database (15 and later as of Django 6.1), and Redis is a built-in cache backend. OpenTelemetry has a Django instrumentation package; Heroku's Python getting-started app is a Django app. Django 6.0 added a tasks interface, but it does not run background jobs itself: production needs a separate worker backend. Maintained by the Django Software Foundation; BSD-licensed.",
    },
    {
      id: "spring-boot",
      name: "Spring Boot",
      primaryHue: "service",
      category: "Application Framework",
      maturity: "production",
      description:
        "Java framework for stand-alone Spring applications, with auto-configuration and production features such as health checks and metrics through Actuator.",
      complexityAdded: "medium",
      trustContribution: "medium",
      pairsWellWith: ["postgresql", "redis", "rabbitmq", "keycloak", "docker", "kubernetes", "opentelemetry", "prometheus"],
      conflictsWith: [],
      patterns: ["twelve-factor", "observable-service"],
      notes:
        "Auto-configuration speeds setup but hides decisions that still need review. Documents auto-configuration for SQL databases, Redis, and RabbitMQ; Prometheus metrics export and OpenTelemetry (OTLP) tracing through Actuator; building OCI images with Cloud Native Buildpacks; and Kubernetes liveness and readiness probes. Keycloak's official quickstarts include Spring Boot services secured through Spring Security. Apache-2.0 licensed.",
    },

    // ── Data ───────────────────────────────────────────────────────────
    {
      id: "postgresql",
      name: "PostgreSQL",
      primaryHue: "data",
      category: "Relational Database",
      maturity: "production",
      description:
        "Open-source relational database with transactions, SQL, and a large extension ecosystem.",
      complexityAdded: "medium",
      trustContribution: "high",
      pairsWellWith: ["nodejs", "django", "spring-boot", "keycloak", "vault", "heroku", "aws"],
      conflictsWith: [],
      patterns: ["twelve-factor"],
      notes:
        "Backups, upgrades, and connection limits are real work unless a managed service (such as Heroku Postgres or Amazon RDS) takes them on, and even then restores need testing. Keycloak can use it as its database; Vault's database secrets engine can issue PostgreSQL credentials. Released under the PostgreSQL Licence.",
    },
    {
      id: "redis",
      name: "Redis",
      primaryHue: "data",
      category: "In-Memory Store",
      maturity: "production",
      description:
        "In-memory data store used for caching, sessions, rate limits, and lightweight queues; durability depends on the persistence configuration.",
      complexityAdded: "low",
      trustContribution: "low",
      pairsWellWith: ["nodejs", "django", "spring-boot"],
      conflictsWith: [],
      patterns: ["twelve-factor"],
      notes:
        "Decide whether it is a cache that can be lost or a store that must persist before relying on it. Django includes a Redis cache backend and Spring Boot auto-configures Spring Data Redis. Licensing changed: Redis 8 and later is offered under a choice of RSALv2, SSPLv1, or AGPLv3; Redis 7.2 and earlier remain BSD-licensed.",
    },
    {
      id: "rabbitmq",
      name: "RabbitMQ",
      primaryHue: "data",
      category: "Message Broker",
      maturity: "production",
      description:
        "Open-source message broker for queues and publish/subscribe between services, supporting AMQP and other protocols.",
      complexityAdded: "medium",
      trustContribution: "medium",
      pairsWellWith: ["nodejs", "spring-boot", "kubernetes", "prometheus"],
      conflictsWith: [],
      patterns: [],
      notes:
        "A queue moves failures rather than removing them: consumers still need retries, idempotency, and a dead-letter plan. Spring Boot has RabbitMQ starters; a RabbitMQ Cluster Operator manages clusters on Kubernetes; a built-in plugin exposes Prometheus metrics. Core is MPL 2.0 licensed.",
    },

    // ── Trust ──────────────────────────────────────────────────────────
    {
      id: "keycloak",
      name: "Keycloak",
      primaryHue: "trust",
      category: "Identity and Access Management",
      maturity: "production",
      description:
        "Open-source, self-hosted identity and access management: login, single sign-on, and OpenID Connect, OAuth 2.0, and SAML for applications and services.",
      complexityAdded: "high",
      trustContribution: "high",
      pairsWellWith: ["spring-boot", "postgresql", "kubernetes", "grafana", "argocd"],
      conflictsWith: [],
      patterns: [],
      notes:
        "Self-hosting identity means owning its upgrades, database, and availability; if it is down, nobody logs in. Uses a relational database such as PostgreSQL; a Keycloak Operator installs it on Kubernetes. Grafana and Argo CD both document Keycloak login. A CNCF project; Apache-2.0 licensed.",
    },
    {
      id: "auth0",
      name: "Auth0",
      primaryHue: "trust",
      category: "Hosted Identity",
      maturity: "production",
      description:
        "Hosted authentication and authorization service from Okta, with SDKs for web, mobile, and back-end frameworks.",
      complexityAdded: "low",
      trustContribution: "high",
      pairsWellWith: ["nextjs", "react-native", "nodejs"],
      conflictsWith: [],
      patterns: [],
      notes:
        "Takes login infrastructure off the team's hands, at the price of a vendor dependency and per-user pricing to check. Authentication does not decide what a logged-in user may do inside the application; that authorization logic still lives in the service. Auth0 publishes SDKs for Next.js, React Native, and Express on Node.js. Proprietary SaaS.",
    },
    {
      id: "vault",
      name: "HashiCorp Vault",
      primaryHue: "trust",
      category: "Secrets Management",
      maturity: "production",
      description:
        "Centralized secrets management with encryption, access control, audit logging, and dynamic credentials.",
      complexityAdded: "high",
      trustContribution: "high",
      pairsWellWith: ["postgresql", "kubernetes", "github-actions", "terraform"],
      conflictsWith: [],
      patterns: ["paved-road"],
      notes:
        "Complex to operate; smaller footprints may be served by a platform's own secret store. The database secrets engine can generate PostgreSQL logins; the Vault Secrets Operator syncs secrets into Kubernetes Secrets; the Vault GitHub Action reads secrets into workflows; a Terraform provider manages Vault. Current versions are under the Business Source License 1.1, with IBM as licensor.",
    },
    {
      id: "trivy",
      name: "Trivy",
      primaryHue: "trust",
      secondaryHue: "delivery",
      category: "Security Scanner and SBOM",
      maturity: "production",
      description:
        "Open-source scanner for container images, filesystems, repositories, Kubernetes, and infrastructure-as-code: finds known vulnerabilities, misconfigurations, and secrets, and generates SBOMs in CycloneDX and SPDX formats.",
      complexityAdded: "low",
      trustContribution: "high",
      pairsWellWith: ["harbor", "github-actions", "docker", "kubernetes", "terraform"],
      conflictsWith: [],
      patterns: ["paved-road", "secrets-in-code"],
      notes:
        "A scan reports known issues; someone must decide which findings block a release. Harbor uses Trivy for image scanning; the trivy-action runs it in GitHub Actions; it can scan Terraform plans. The scanner's own supply chain was compromised in March 2026 (CVE-2026-33634): a malicious v0.69.4 release and hijacked trivy-action and setup-trivy tags on March 19, then malicious v0.69.5 and v0.69.6 Docker Hub images on March 22. The advisory recommends pinning actions to full commit SHAs. Maintained by Aqua Security; Apache-2.0 licensed.",
    },

    // ── Delivery ───────────────────────────────────────────────────────
    {
      id: "github",
      name: "GitHub",
      primaryHue: "delivery",
      category: "Source Control and Code Review",
      maturity: "production",
      description:
        "Hosted Git repositories with pull requests, code review, branch protection, and issue tracking.",
      complexityAdded: "low",
      trustContribution: "medium",
      pairsWellWith: ["github-actions", "argocd", "heroku"],
      conflictsWith: [],
      patterns: ["gitops-loop", "secrets-in-code"],
      notes:
        "Review only protects main if branch protection requires it. Committed secrets stay in history until rotated. Argo CD documents GitHub webhooks for faster sync; the Heroku CLI can connect a GitHub repository to a Heroku pipeline. Proprietary SaaS from Microsoft.",
    },
    {
      id: "github-actions",
      name: "GitHub Actions",
      primaryHue: "delivery",
      category: "CI/CD",
      maturity: "production",
      description:
        "CI/CD service built into GitHub: workflows defined in the repository run builds, tests, and deploys on events such as pushes and pull requests.",
      complexityAdded: "low",
      trustContribution: "medium",
      pairsWellWith: ["github", "docker", "harbor", "trivy", "terraform", "aws", "vault"],
      conflictsWith: [],
      patterns: ["paved-road", "secrets-in-code"],
      notes:
        "Third-party actions run with the workflow's secrets and permissions; pin them to full commit SHAs, as the 2026 trivy-action compromise showed. Official actions exist for Docker builds, Terraform setup, AWS credentials via OIDC, and Vault secrets. Pushing to Harbor uses a Harbor robot account, which Harbor provides for automation.",
    },
    {
      id: "harbor",
      name: "Harbor",
      primaryHue: "delivery",
      secondaryHue: "trust",
      category: "Artifact Registry",
      maturity: "production",
      description:
        "Open-source container registry that stores, signs, and scans images and other OCI artifacts, with access control, replication, and audit logs.",
      complexityAdded: "medium",
      trustContribution: "high",
      pairsWellWith: ["trivy", "docker", "github-actions", "kubernetes"],
      conflictsWith: [],
      patterns: ["paved-road"],
      notes:
        "Self-hosted, so the registry becomes a service the team runs. Vulnerability scanning uses Trivy, enabled at install time, and other scanners can be plugged in. Scanning does not block a pull or deploy until a policy is set. A CNCF-hosted project; Apache-2.0 licensed.",
    },
    {
      id: "argocd",
      name: "Argo CD",
      primaryHue: "delivery",
      secondaryHue: "platform",
      category: "GitOps Continuous Delivery",
      maturity: "production",
      description:
        "Declarative GitOps continuous delivery for Kubernetes: keeps cluster state in sync with manifests in Git and reports drift.",
      complexityAdded: "medium",
      trustContribution: "medium",
      pairsWellWith: ["kubernetes", "github", "prometheus", "keycloak"],
      conflictsWith: [],
      patterns: ["gitops-loop", "platform-before-product"],
      notes:
        "Deploys what is in Git; it does not build or test it, so CI still has to exist upstream. Kubernetes-only. Exposes Prometheus metrics, with an example Grafana dashboard; supports GitHub webhooks, OCI images as an application source, and Keycloak login. Part of the CNCF Argo project; Apache-2.0 licensed.",
    },

    // ── Platform ───────────────────────────────────────────────────────
    {
      id: "heroku",
      name: "Heroku",
      primaryHue: "platform",
      category: "Managed PaaS",
      maturity: "production",
      description:
        "Managed platform from Salesforce that builds and runs applications from source with buildpacks or Docker images, with add-ons such as Heroku Postgres.",
      complexityAdded: "low",
      trustContribution: "medium",
      pairsWellWith: ["nodejs", "django", "postgresql", "github", "docker", "terraform"],
      conflictsWith: [],
      patterns: ["twelve-factor"],
      notes:
        "Less to operate, at the price of a vendor dependency and the platform's limits on how apps run. Offers Node.js and Python buildpacks, a Container Registry for Docker images, pipelines that can be connected to a GitHub repository, and a Terraform provider. Proprietary PaaS.",
    },
    {
      id: "docker",
      name: "Docker",
      primaryHue: "platform",
      category: "Containerization",
      maturity: "production",
      description:
        "Builds and runs OCI container images that package an application with its dependencies.",
      complexityAdded: "low",
      trustContribution: "low",
      pairsWellWith: ["nodejs", "spring-boot", "trivy", "github-actions", "harbor", "heroku", "kubernetes", "self-hosted"],
      conflictsWith: [],
      patterns: ["twelve-factor", "secrets-in-code"],
      notes:
        "Packaging, not a platform on its own: something still has to run, restart, and scale containers. Secrets baked into image layers remain readable from the image. Images can be built in GitHub Actions with docker/build-push-action, scanned by Trivy, stored in a registry such as Harbor, and run on Kubernetes, Heroku, or the team's own machines. Docker Engine installs on Linux servers; on macOS it comes through Docker Desktop, which needs a paid subscription for commercial use in organizations with more than 250 employees or more than $10 million in annual revenue.",
    },
    {
      id: "kubernetes",
      name: "Kubernetes",
      primaryHue: "platform",
      category: "Orchestration",
      maturity: "production",
      description:
        "Open-source container orchestration: schedules, restarts, and scales containers across a cluster from declarative configuration.",
      complexityAdded: "high",
      trustContribution: "high",
      pairsWellWith: ["spring-boot", "rabbitmq", "keycloak", "vault", "trivy", "harbor", "argocd", "docker", "terraform", "aws", "opentelemetry", "prometheus", "self-hosted"],
      conflictsWith: [],
      patterns: ["gitops-loop", "platform-before-product"],
      notes:
        "Steep learning curve and meaningful operating overhead, even when managed (for example Amazon EKS). Use it when container orchestration is warranted, not because it may be needed later. Components emit Prometheus-format metrics; operators exist for Keycloak, RabbitMQ, Vault secrets, and OpenTelemetry. Runs on premises as well as in a cloud; kubeadm installs it on the team's own Linux hosts, which then carry the cluster's upgrades as well as their own. CNCF graduated project; Apache-2.0 licensed.",
    },
    {
      id: "terraform",
      name: "Terraform",
      primaryHue: "platform",
      category: "Infrastructure as Code",
      maturity: "production",
      description:
        "Infrastructure as code tool: describes cloud and service resources in configuration files, shows a plan of changes, then applies it.",
      complexityAdded: "medium",
      trustContribution: "medium",
      pairsWellWith: ["aws", "kubernetes", "heroku", "vault", "github-actions", "trivy", "grafana", "pagerduty"],
      conflictsWith: [],
      patterns: ["paved-road", "snowflake-server", "platform-before-product"],
      notes:
        "State files can contain secrets and must be stored and locked carefully. Providers exist for AWS, Kubernetes, Heroku, Vault, Grafana, and PagerDuty; hashicorp/setup-terraform runs it in GitHub Actions; Trivy can scan its plans. Terraform 1.6 and later is under the Business Source License 1.1, with IBM as licensor. OpenTofu is a community fork under MPL 2.0.",
    },
    {
      id: "aws",
      name: "Amazon Web Services",
      primaryHue: "platform",
      category: "Cloud Provider",
      maturity: "production",
      description:
        "Public cloud with compute, managed databases, managed Kubernetes, networking, and identity services.",
      complexityAdded: "high",
      trustContribution: "medium",
      pairsWellWith: ["postgresql", "kubernetes", "terraform", "github-actions", "opentelemetry"],
      conflictsWith: [],
      patterns: ["snowflake-server"],
      notes:
        "Breadth is the strength and the cost: IAM, networking, and billing need owners from the start. Offers managed PostgreSQL (Amazon RDS) and Kubernetes (Amazon EKS); the Terraform AWS provider manages resources; configure-aws-credentials lets GitHub Actions assume a role through OIDC instead of stored keys; the AWS Distro for OpenTelemetry Collector sends telemetry to CloudWatch and other backends.",
    },
    {
      id: "self-hosted",
      name: "Self-hosted hardware",
      primaryHue: "platform",
      category: "On-Prem and Local Hardware",
      maturity: "production",
      description:
        "A generic option, not a vendor product: the team's own servers, workstations, or small machines such as Mac minis, on premises or in a colo, running the stack directly instead of a cloud or managed platform.",
      complexityAdded: "high",
      trustContribution: "medium",
      pairsWellWith: ["docker", "kubernetes", "prometheus"],
      conflictsWith: [],
      patterns: ["snowflake-server"],
      notes:
        "What you gain: data stays on hardware you control, and most of the cost is paid up front for hardware rather than metered, though power, space, and staff time recur. What you take on is everything a provider would otherwise do: OS and firmware patching, power and network (including what happens in an outage), backups that leave the building and restores that are tested, physical security of the machines, and capacity planning, since more capacity means buying and installing hardware. One machine is one failure domain. Docker can package what runs on it; Kubernetes can run on premises through kubeadm once several machines and services justify a cluster; Prometheus's node_exporter reports the hosts' own disk, memory, and CPU. Terraform is not paired here: it manages resources through provider APIs, and plain hardware has none unless a virtualization or bare-metal layer adds one. Machines set up by hand over SSH drift into snowflake servers, so keep their configuration in version control.",
    },

    // ── Operations ─────────────────────────────────────────────────────
    {
      id: "opentelemetry",
      name: "OpenTelemetry",
      primaryHue: "operations",
      category: "Standards-Based Instrumentation",
      maturity: "production",
      description:
        "Vendor-neutral instrumentation framework for traces, metrics, and logs. Exports over OTLP to many backends; it is not a storage or UI backend itself.",
      complexityAdded: "medium",
      trustContribution: "high",
      pairsWellWith: ["nextjs", "nodejs", "django", "spring-boot", "kubernetes", "aws", "prometheus"],
      conflictsWith: [],
      patterns: ["observable-service", "unwatched-release"],
      notes:
        "Instrumentation without a backend, dashboards, and alert rules watches nothing. Next.js, Spring Boot, the Node.js SDK, and Django instrumentation all emit OpenTelemetry; Prometheus can receive OTLP metrics once its receiver is enabled; an operator manages collectors on Kubernetes. A CNCF project.",
    },
    {
      id: "prometheus",
      name: "Prometheus",
      primaryHue: "operations",
      category: "Metrics and Alerting",
      maturity: "production",
      description:
        "Open-source metrics system: scrapes and stores time series, queries them with PromQL, and evaluates alert rules, with Alertmanager routing notifications.",
      complexityAdded: "medium",
      trustContribution: "high",
      pairsWellWith: ["spring-boot", "rabbitmq", "argocd", "kubernetes", "opentelemetry", "grafana", "pagerduty", "self-hosted"],
      conflictsWith: [],
      patterns: ["observable-service", "gitops-loop"],
      notes:
        "Metrics only; logs and traces need other stores. Long-term retention and high availability take extra design. Alertmanager has a PagerDuty receiver; Grafana has a Prometheus data source; the OTLP receiver is off by default. The official node_exporter exposes hardware and OS metrics from Linux and other Unix hosts, which is how Prometheus watches the team's own machines. CNCF graduated project; Apache-2.0 licensed.",
    },
    {
      id: "grafana",
      name: "Grafana",
      primaryHue: "operations",
      category: "Dashboards and Alerting",
      maturity: "production",
      description:
        "Open-source dashboards and alerting over many data sources, including Prometheus.",
      complexityAdded: "low",
      trustContribution: "medium",
      pairsWellWith: ["prometheus", "pagerduty", "keycloak", "terraform"],
      conflictsWith: [],
      patterns: ["observable-service", "gitops-loop"],
      notes:
        "A dashboard nobody looks at is not monitoring; alert rules and owners matter more than panel count. Documents a PagerDuty contact point and Keycloak login; a Terraform provider can manage dashboards and alerts as code. AGPLv3 licensed, with a hosted Grafana Cloud offering.",
    },
    {
      id: "pagerduty",
      name: "PagerDuty",
      primaryHue: "operations",
      category: "Incident Response",
      maturity: "production",
      description:
        "Hosted on-call and incident response service: receives alerts, routes them to whoever is on call, and escalates if nobody responds.",
      complexityAdded: "low",
      trustContribution: "medium",
      pairsWellWith: ["prometheus", "grafana", "terraform"],
      conflictsWith: [],
      patterns: ["unwatched-release"],
      notes:
        "Pages only on alerts something else raises; it does not measure the system. Noisy alerts train people to ignore pages. Prometheus Alertmanager and Grafana both document PagerDuty integrations; a Terraform provider manages schedules and services as code. Proprietary SaaS.",
    },
  ],

  patterns: [
    // ── Anti-patterns ──────────────────────────────────────────────────
    {
      id: "platform-before-product",
      name: "The Platform Before the Product",
      type: "anti-pattern",
      hues: ["platform", "delivery"],
      description:
        "Orchestration, GitOps, and infrastructure as code arrive before there is CI, telemetry, or a second service to justify them. The platform looks production-ready; the one application on it has no tests gating a release and nothing watching it run.",
      strengths: [],
      weaknesses: [
        "Team time goes to the cluster rather than the product",
        "Operating load of a platform, with the benefits of one service",
        "GitOps faithfully deploys changes nobody has tested",
      ],
      watchFor: [
        "A Kubernetes cluster running a single service",
        "Argo CD in place but no CI job that runs tests",
        "No dashboard or alert for the one thing users depend on",
      ],
    },
    {
      id: "unwatched-release",
      name: "The Unwatched Release",
      type: "anti-pattern",
      hues: ["operations"],
      description:
        "Changes ship, and the team learns whether they worked from users. There is no telemetry to compare before and after, and no alert that wakes someone when error rates climb.",
      strengths: [],
      weaknesses: [
        "Outages found by customers, not by the team",
        "No baseline to judge whether a release made things better or worse",
        "Root cause analysis starts from nothing",
      ],
      watchFor: [
        "Production services with no traces, metrics, or structured logs",
        "Telemetry collected but no alert rules or on-call owner",
        "Deploys with no health signal checked afterwards",
      ],
    },
    {
      id: "secrets-in-code",
      name: "The Secrets in Code",
      type: "anti-pattern",
      hues: ["trust", "delivery"],
      description:
        "API keys, database passwords, and tokens sit in the repository, in CI configuration, or in container image layers because that was the quickest way to make it work. Anyone with read access to the code or the image has the credentials, and deleting the line does not remove it from history.",
      strengths: [],
      weaknesses: [
        "Credentials spread to every clone, fork, and image pull",
        "Rotation is manual and often skipped",
        "No audit of who used a credential or when",
      ],
      watchFor: [
        ".env files or config with real values committed to Git",
        "Secrets passed as build arguments or copied into Dockerfiles",
        "Long-lived cloud keys stored as CI secrets instead of short-lived OIDC credentials",
      ],
    },
    {
      id: "snowflake-server",
      name: "The Snowflake Server",
      type: "anti-pattern",
      hues: ["platform"],
      description:
        "Infrastructure was built by hand in a console or over SSH, and only the person who built it knows how. It works until it has to be rebuilt, copied for a second environment, or audited.",
      strengths: [],
      weaknesses: [
        "Environments drift apart and cannot be reproduced",
        "Disaster recovery depends on memory",
        "Changes are unreviewed and unrecorded",
      ],
      watchFor: [
        "Production resources that exist in no configuration file",
        "Console changes made during incidents and never written back",
        "Staging that differs from production in ways nobody can list",
      ],
    },

    // ── Positive patterns ─────────────────────────────────────────────
    {
      id: "twelve-factor",
      name: "The Twelve-Factor App",
      type: "foundational",
      hues: ["service", "data", "platform"],
      description:
        "The service keeps configuration in the environment, treats databases and caches as attached resources, and runs as stateless processes that a platform can start, stop, and scale. The methodology was written by people who built the Heroku platform; it applies wherever the platform can inject config and replace processes.",
      strengths: [
        "The same build runs in every environment with different config",
        "Processes can be replaced or scaled without losing state",
        "Backing services can be swapped by changing a URL",
      ],
      weaknesses: [
        "State has to live somewhere else, which moves the hard problems to the data layer",
        "Environment variables are not a secrets manager",
      ],
      watchFor: [
        "Local files or in-memory sessions that break when a process restarts",
        "Config that differs by environment compiled into the build",
        "Database migrations run by hand",
      ],
    },
    {
      id: "paved-road",
      name: "The Paved Road",
      type: "structural",
      hues: ["delivery", "platform", "trust"],
      description:
        "A shared, documented path from commit to running service: one CI template, one registry, scanned base images, infrastructure from reviewed code, and secrets fetched at run time. Teams can leave the road; the aim is that staying on it is the easiest option.",
      strengths: [
        "Security checks happen by default rather than by memory",
        "New services start with delivery and infrastructure already solved",
        "One place to fix a pipeline or base image for everyone",
      ],
      weaknesses: [
        "Someone has to own and maintain the road",
        "A road built too early, or too rigid, gets bypassed",
      ],
      watchFor: [
        "Scan results that never block anything",
        "Teams copying the template once and never updating it",
        "Third-party CI actions pinned to mutable tags",
      ],
    },
    {
      id: "observable-service",
      name: "The Observable Service",
      type: "foundational",
      hues: ["service", "operations"],
      description:
        "The service emits traces, metrics, and logs from its first release, and a small set of alerts tied to what users notice (errors, latency, saturation) reaches a person on call. The team can answer 'is it working?' without asking a user.",
      strengths: [
        "More failures are found by alerts before customers report them",
        "Releases can be compared against a baseline",
        "Incidents start from evidence rather than guesses",
      ],
      weaknesses: [
        "Telemetry volume costs money and needs retention decisions",
        "Alert rules need tuning, or they become noise",
      ],
      watchFor: [
        "Instrumentation with no backend or dashboards",
        "Alerts on causes (CPU) rather than symptoms users feel",
        "Nobody named as owner of an alert",
      ],
    },
    {
      id: "gitops-loop",
      name: "The GitOps Loop",
      type: "structural",
      hues: ["delivery", "platform", "operations"],
      description:
        "Desired cluster state lives in Git; a controller applies it and reports drift; telemetry shows whether the change behaved. Every change is recorded in Git, review can be required before it merges, and many rollbacks become a revert. The loop only closes if operations signals feed back into the next change.",
      strengths: [
        "Every production change is recorded in Git, and branch protection can require review",
        "Drift between Git and the cluster is visible",
        "Rolling back a manifest change is a revert; data and schema changes still need their own plan",
      ],
      weaknesses: [
        "Needs Kubernetes and a controller to run, which is real operating load",
        "Secrets need a separate path; they do not belong in the Git repository",
      ],
      watchFor: [
        "Manual kubectl changes that the controller silently reverts or reports as drift",
        "No CI upstream, so GitOps deploys untested manifests",
        "Sync succeeds but nobody checks whether the service is healthy",
      ],
    },
  ],

  recipes: [
    {
      id: "starter-app",
      name: "The Starter App",
      tools: ["nextjs", "nodejs", "postgresql", "heroku"],
      patternIds: ["twelve-factor"],
      useCase:
        "A small team getting a first web application in front of users: a Next.js front end, Node.js on the server, PostgreSQL for data, and a managed platform so nobody runs servers. Think: internal tool, first product, pilot.",
      whyItWorks: [
        "Next.js and its server code run on Node.js, so one language covers front end and back end",
        "PostgreSQL holds application data with transactions and a familiar SQL model",
        "Heroku builds from source with its Node.js buildpack and offers Heroku Postgres, so there is no infrastructure to hand-build",
        "Config in the environment keeps the app close to twelve-factor from the start",
      ],
      whereItBreaks: [
        "No login or secrets management beyond the platform's config vars",
        "No CI: nothing tests a change before it deploys",
        "Nothing watches the app in production or pages anyone",
      ],
      missingHues: ["trust", "delivery", "operations"],
      upgradePath: ["auth0", "github-actions", "opentelemetry"],
    },
    {
      id: "authenticated-app",
      name: "The Authenticated App",
      tools: ["nextjs", "nodejs", "postgresql", "heroku", "auth0", "github-actions"],
      patternIds: ["twelve-factor"],
      useCase:
        "The starter app once real users log in and more than one person commits: hosted identity, and a CI workflow that runs tests before a change ships.",
      whyItWorks: [
        "Auth0 handles login through its Next.js and Node.js SDKs, so the team does not store passwords",
        "A GitHub Actions workflow runs tests on every pull request",
        "The rest of the starter app is unchanged, so the step up is small",
      ],
      whereItBreaks: [
        "Authentication is not authorization: what each user may do is still application code",
        "The recipe does not say how a passing build reaches Heroku: a deploy step in the workflow or a Heroku-side deploy from GitHub needs choosing",
        "Still nothing watches production or pages anyone when it fails",
      ],
      missingHues: ["operations"],
      upgradePath: ["opentelemetry", "pagerduty"],
    },
    {
      id: "watched-app",
      name: "The Watched App",
      tools: ["nextjs", "nodejs", "postgresql", "heroku", "auth0", "github-actions", "opentelemetry", "pagerduty"],
      patternIds: ["observable-service"],
      useCase:
        "The authenticated app with instrumentation and on-call paging: every role has a part, though a telemetry backend with alert rules is still needed before anyone is paged.",
      whyItWorks: [
        "Next.js and the Node.js SDK both emit OpenTelemetry, so front-end server code and back end share one instrumentation standard",
        "PagerDuty routes alerts to whoever is on call and escalates when nobody answers",
        "Each hue is covered by one product, with no duplicated roles",
      ],
      whereItBreaks: [
        "OpenTelemetry is not a backend: traces and metrics need somewhere to be stored, queried, and turned into alerts before PagerDuty sees anything",
        "Covering every hue is not the same as every role being deep; identity, CI, and platform are all at their simplest",
        "Alert rules and on-call rotations are team work no product supplies",
      ],
      missingHues: [],
      upgradePath: ["prometheus", "grafana", "trivy"],
    },
    {
      id: "container-service",
      name: "The Container Service",
      tools: ["django", "postgresql", "redis", "docker", "harbor", "github-actions", "trivy", "terraform"],
      patternIds: ["twelve-factor", "paved-road"],
      useCase:
        "A back-end service shipped as a scanned container image: Django with PostgreSQL and a Redis cache, built and scanned in CI, stored in a private registry, with infrastructure described in Terraform. Think: an API behind another team's front end.",
      whyItWorks: [
        "Django officially supports PostgreSQL and includes a Redis cache backend",
        "A GitHub Actions workflow builds the Docker image and scans it with Trivy before pushing it",
        "Harbor stores the image, can rescan it with Trivy, and adds access control and activity auditing",
        "Terraform describes the infrastructure, so environments can be reviewed and rebuilt",
      ],
      whereItBreaks: [
        "Nothing here runs the containers; the target platform is left open",
        "Scans only help if a policy blocks releases on findings someone has triaged",
        "Pin third-party actions, including trivy-action, to commit SHAs; mutable tags were hijacked in March 2026",
        "No telemetry or alerting, and no front end",
      ],
      missingHues: ["experience", "operations"],
      upgradePath: ["opentelemetry", "prometheus", "pagerduty"],
    },
    {
      id: "gitops-platform",
      name: "The GitOps Platform",
      tools: ["kubernetes", "argocd", "harbor", "terraform", "prometheus", "grafana", "pagerduty", "vault"],
      patternIds: ["gitops-loop", "paved-road"],
      useCase:
        "A shared platform for several teams and services: clusters from Terraform, deploys from Git through Argo CD, images from Harbor, secrets from Vault, and metrics, dashboards, and paging wired in. Think: a platform team serving many product teams.",
      whyItWorks: [
        "Argo CD keeps clusters in sync with Git and exposes Prometheus metrics about its own syncs",
        "Harbor gives the platform one registry with scanning and access control",
        "Vault syncs secrets into Kubernetes through its operator, so they stay out of the Git repository",
        "Prometheus scrapes cluster and application metrics; Grafana shows them; both can page through PagerDuty",
        "Terraform describes the clusters (through the cloud provider's own Terraform provider) and can manage Grafana and PagerDuty configuration as code",
      ],
      whereItBreaks: [
        "This is a platform with no product on it: the services, data, and front ends come from the teams it serves",
        "No CI in the recipe; Argo CD deploys whatever reaches Git",
        "Operating load is substantial: a cluster, a registry, Vault, and a monitoring stack each need owners",
        "Worth building once there are several services; before that it is the platform-before-product caution",
      ],
      missingHues: ["experience", "service", "data"],
      upgradePath: ["github-actions", "trivy", "opentelemetry"],
    },
    {
      id: "platform-before-product",
      name: "The Platform Before the Product",
      tools: ["nodejs", "kubernetes", "argocd", "terraform"],
      patternIds: ["platform-before-product", "unwatched-release"],
      useCase:
        "(Anti-pattern) One Node.js service, deployed to a Terraform-built Kubernetes cluster through Argo CD. The platform is sized for many services; the product is a single service with no CI, no telemetry, and no login.",
      whyItHappens: [
        "Kubernetes and GitOps are what the team expects to need eventually, so they start there",
        "Platform work is visible progress while product direction is still unclear",
        "Argo CD's delivery can look like CI, although it does not build or test anything",
      ],
      symptoms: [
        "Most engineering time goes to the cluster, not the service",
        "Untested changes sync to production because Git is the only gate",
        "Outages are reported by users; there is nothing to look at",
        "The cluster's cost and upkeep are out of proportion to one service",
      ],
      fix: [
        "Add CI first: run tests in GitHub Actions before anything reaches the deploy branch",
        "Instrument the service with OpenTelemetry and alert on what users feel",
        "Consider a managed platform (Heroku is this edition's example) until there is a second service and a team to run a cluster, keeping Terraform for what remains",
      ],
      missingHues: ["experience", "data", "trust", "operations"],
      upgradePath: ["github-actions", "opentelemetry", "heroku"],
    },
    {
      id: "self-hosted-app",
      name: "The Self-Hosted App",
      tools: ["nextjs", "nodejs", "postgresql", "docker", "self-hosted", "keycloak", "prometheus", "grafana"],
      patternIds: ["twelve-factor"],
      useCase:
        "A web application run on hardware the team owns: containers on its own servers or a small machine in an office or colo, self-hosted login, and metrics with dashboards. Think: data that must stay on premises, or a steady workload where a fixed hardware cost is easier to plan than a metered bill.",
      whyItWorks: [
        "Docker packages the app from the official Node.js image, so the machine runs the image that was built rather than a hand-installed copy",
        "Keeping config in the environment and PostgreSQL as an attached resource lets the app be moved to another machine, or a cloud, later",
        "Keycloak provides login without a hosted identity vendor and can use PostgreSQL as its database",
        "Prometheus, with node_exporter, watches the hardware itself as well as services; Grafana shows it and supports Keycloak login",
      ],
      whereItBreaks: [
        "No CI: nothing tests or builds a change before it reaches the machine",
        "The team owns what a provider would: OS and firmware patching, power, network, backups, physical security, and replacing failed parts",
        "One machine is one failure domain: a power cut or dead disk takes down the app, its database, login, and the monitoring that would have reported it",
        "PostgreSQL backups must leave the machine, and restores need testing; if Keycloak shares the server, give it its own database and user",
        "node_exporter covers the host; Next.js and Node.js need instrumentation before Prometheus sees application metrics, and alerts need a receiver someone watches",
        "Machines set up by hand over SSH become snowflake servers; keep their setup in version-controlled configuration",
      ],
      missingHues: ["delivery"],
      upgradePath: ["github-actions", "trivy", "opentelemetry"],
    },
  ],
};
