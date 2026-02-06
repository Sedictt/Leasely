# Scope and Delimitation

## Scope

This project focuses on the design and development of a dual-platform (Web and Mobile) ecosystem, iReside, optimized for the multi-unit rental market within Barangay Marulas, Valenzuela City. The system encompasses three primary interfaces: a Discovery Portal for prospective tenants, a Visual Command Center for landlords and property managers, and an Administrative Oversight Portal for system moderation.

### System Coverage

The scope includes end-to-end rental lifecycle support within the target locale, covering listing discovery, tenant inquiry, lease creation and signing, maintenance reporting, payment tracking, and basic administrative oversight. The web platform is the primary delivery channel, with mobile access focused on responsive, browser-based experiences.

### Core User Roles

The system supports three stakeholder groups: (1) Tenants who discover and inquire about units, communicate with landlords, and manage lease-related tasks; (2) Landlords and property managers who publish listings, manage tenants and units, track finances, and respond to maintenance; and (3) Administrators who validate landlord applications and moderate listings for compliance with platform policies.

### Property and Spatial Management

The system includes a 2D Spatial Canvas featuring a Modular Floor Planner where landlords can digitally map building layouts using drag-and-drop units. This is enhanced by Dynamic Status Overlays providing real-time visual alerts for occupancy, overdue payments (Red), and active maintenance (Orange Pulse).

### Tenant Experience

The tenant-facing experience includes a Map-based Discovery Portal with location-aware radius filters (1km to 10km), a Real-time Messaging Engine, and a secure Digital Lease Signing workflow that utilizes canvas-based signatures.

### Listing and Inquiry Workflow

The scope covers listing creation, publication, and moderation, alongside inquiry handling and tenant-landlord communications. Listing data includes unit details, photos, amenities, pricing, and availability status, with inquiry status tracking for landlord follow-up.

### Financial and Operational Tools

The scope includes automated digital invoicing, a comprehensive financial ledger for tracking revenue and expenses, and a localized manual payment verification system where tenants upload GCash receipts and reference numbers for landlord approval.

### Maintenance and Service Operations

The system supports tenant-submitted maintenance requests, landlord prioritization and status updates, and basic work order tracking for operational visibility.

### AI Integration

The system utilizes supportive AI utilities for two primary functions: (1) triaging maintenance reports via natural language processing to categorize severity and estimate costs, and (2) a Property Concierge that answers tenant FAQs based on a landlord-configured knowledge base.

### Administrative Security

A dedicated Admin Portal is included to vet landlord applications, ensuring that only legally operating properties with valid business permits and government IDs are accessible on the platform.

### Data and Security Practices

The scope includes role-based access control, secure authentication, and audit-friendly data handling appropriate for a rental management platform. Data is structured around tenants, landlords, properties, units, leases, payments, and maintenance records.

## Delimitation

The study is subject to the following constraints and exclusions. Each delimitation is stated to define boundaries, reduce scope creep, and ensure feasibility within time, budget, and data access limitations.

### A. Geographic and Demographic Boundaries

Justification: The study is constrained by available local data, limited validation resources, and the need to keep the research context controllable and comparable during evaluation.

1. The system is limited to Barangay Marulas, Valenzuela City. Locations outside this barangay are excluded to keep geospatial data collection and validation manageable.
2. The platform focuses on residential multi-unit properties only (apartments, dormitories, boarding houses). Single-family homes, transient hotels, and commercial properties are out of scope due to differing workflows and regulatory requirements.
3. The discovery map uses barangay-level geographic references and does not attempt city-wide or regional parcel datasets because of data availability and licensing limits.
4. Tenant demographics are not segmented by age, income, or employment type to avoid profiling and to reduce data privacy risks.
5. The study does not attempt to model seasonal migration or city-wide housing demand trends; the focus is operational management, not urban analytics.

### B. Property and Unit Modeling Constraints

Justification: The spatial tool is designed for operational visualization by non-technical landlords; engineering-grade modeling, specialized compliance checks, and advanced geometry would require CAD workflows and professional validation outside the capstone scope.

6. The 2D Spatial Canvas is for organizational visualization only and does not replace architectural CAD tools; it does not produce engineering-grade measurements.
7. The floor planner uses a simplified grid and does not support irregular or curved geometry to keep the UI accessible for non-technical landlords.
8. Unit layouts do not include 3D rendering, photorealistic visualization, or BIM integration due to tooling complexity.
9. The system does not compute structural load, building code compliance, or fire safety assessments.
10. The platform does not manage multi-building campuses with shared infrastructure beyond basic grouping, since such estates require specialized facilities software.
11. The unit status overlays are informational only and do not automatically trigger maintenance dispatch or penalty enforcement.
12. The system does not generate automated eviction notices based on occupancy or payment status.

### C. Discovery and Search Constraints

Justification: Discovery features prioritize clarity and performance using available, landlord-provided data; advanced GIS layers and third-party datasets require licensing, data partnerships, and ongoing maintenance not feasible in the current study.

13. The discovery portal provides radius-based filtering only; advanced spatial analytics (walkability scores, heat maps, crime overlays) are excluded.
14. Map accuracy depends on landlord-provided coordinates and is not validated against government parcel records.
15. The map does not provide turn-by-turn navigation or route planning.
16. The platform does not integrate real-time traffic, public transit, or commute-time optimization.
17. Public listing moderation is limited to admin approval and does not include external marketplace syndication.

### D. Messaging and Communication Limits

Justification: Communication is scoped to essential in-app messaging to reduce infrastructure complexity, operating costs, and regulatory burdens tied to telecom and advanced encryption services.

18. Messaging is limited to in-app text and does not include voice calls or video conferencing.
19. The system does not provide encrypted end-to-end messaging; it uses standard secure transport and access control only.
20. Message retention policies are basic and do not meet enterprise archiving requirements.
21. The platform does not integrate with external SMS gateways or email marketing systems for outreach campaigns.
22. Automated notification rules are limited to predefined events and are not user-programmable workflows.

### E. Lease and Document Handling

Justification: Legal document workflows vary significantly by jurisdiction; full notarization, enforceability validation, and legal dispute handling would require legal partnerships beyond the project’s academic scope.

23. The digital lease signing workflow supports canvas-based signatures but does not provide third-party notarization.
24. The platform does not verify the legal enforceability of uploaded contracts; landlords are responsible for compliance.
25. Document templates are basic and do not adapt dynamically to local legal clauses.
26. The system does not manage legal disputes, arbitration, or court filing processes.
27. Lease amendments require manual revision and do not include automated redlining or version comparison.

### F. Financial Operations and Payments

Justification: Direct payment processing introduces compliance, security, and operational risks (e.g., KYC/AML and payment disputes). Manual verification is used to keep the system feasible and auditable within a capstone timeline.

28. The system records payment schedules and invoice history but does not execute actual fund transfers.
29. There is no direct integration with payment gateways, bank APIs, or GCash APIs due to cost and compliance constraints.
30. Receipt verification is manual and dependent on landlord approval; no automated OCR-based fraud detection is included.
31. The system does not compute tax deductions, VAT filings, or government remittance schedules.
32. Currency support is limited to PHP; multi-currency handling is excluded to reduce accounting complexity.
33. The ledger is designed for operational tracking only and is not a substitute for audited accounting systems.

### G. Maintenance and Work Orders

Justification: Contractor assignment, procurement, and compliance tracking require operational partnerships and specialized process management not available to the research team.

34. Maintenance requests are categorized by AI assistance but do not automatically assign contractors.
35. The platform does not include vendor bidding, procurement workflows, or inventory management.
36. Work order scheduling is basic and does not optimize staff routing or labor allocation.
37. There is no integration with external facilities management platforms.
38. The system does not manage compliance with building inspection schedules or safety certification renewals.

### H. AI Utility Boundaries

Justification: AI functions are intentionally assistive to avoid liability and decision-making risks; the system emphasizes human confirmation to ensure accountability.

39. AI outputs are advisory only and require human confirmation before action is taken.
40. The AI does not autonomously approve budgets, contracts, or legal decisions.
41. The AI knowledge base is landlord-configured and does not pull data from public internet sources in real time.
42. The AI does not provide legal advice or guarantee accuracy of recommendations.
43. The system does not include AI-based credit scoring or tenant background checks.

### I. Administrative Governance

Justification: The admin portal provides platform-level moderation only; government verification and regulatory compliance auditing require formal authority and external integrations not accessible to this project.

44. Admin vetting validates document presence only and does not replace government-level verification.
45. The platform does not verify authenticity of permits beyond basic format checks.
46. Admin tools do not include full compliance auditing or periodic regulatory reporting.
47. The system does not manage landlord licensing renewals or tax registration.
48. Admin moderation is limited to platform policy enforcement and does not arbitrate legal disputes.

### J. Security and Privacy Constraints

Justification: Enterprise security models and certifications demand significant investment, third-party audits, and dedicated security teams. The project applies standard best practices appropriate to an academic prototype.

49. The system uses standard access control but does not provide military-grade encryption or zero-trust networking.
50. Data is stored in a cloud database; on-premise deployments are not supported in this version.
51. The platform does not support offline-first synchronization; an active internet connection is required.
52. The system does not implement advanced data loss prevention or enterprise SIEM integrations.
53. User data anonymization is not automated beyond standard access controls.
54. The system does not provide biometric authentication options.

### K. Device and Platform Limits

Justification: The system targets modern browsers to reduce development overhead and ensure reliable performance on typical devices used by the target community.

55. The mobile experience is optimized for modern browsers and does not provide a native offline app.
56. Older devices and legacy browsers may not be fully supported.
57. The system does not guarantee performance on low-end hardware under heavy data loads.
58. Push notifications are limited to web notifications where supported and not to native OS channels.

### L. Integration and Interoperability

Justification: External integrations require stable APIs, vendor agreements, and long-term maintenance. These are excluded to keep dependencies minimal and evaluation focused on core workflows.

59. The platform does not integrate with external listing marketplaces by default.
60. There is no integration with government housing databases or national ID verification services.
61. The system does not provide open APIs for third-party developers in this version.
62. Data export options are limited to basic reports and are not designed for large-scale data warehousing.

### M. Analytics and Reporting

Justification: The study focuses on operational support rather than predictive decision-making; advanced analytics requires larger datasets and long-term data collection not available during development.

63. Reporting is operational and descriptive; predictive analytics and forecasting are excluded.
64. The system does not include real-time business intelligence dashboards with custom KPIs.
65. Data analytics is limited to the platform dataset and does not blend external sources.

### N. Testing, Validation, and Evaluation

Justification: The evaluation scope is limited to the target locale and feasible testing methods within the capstone timeline, budget, and participant availability.

66. The study does not conduct large-scale usability testing beyond the target barangay.
67. Performance benchmarks are limited to expected local usage volumes and not city-wide load tests.
68. Security testing is limited to standard best practices and does not include formal penetration testing.
69. The system does not undergo third-party certifications (e.g., ISO, SOC) due to scope and budget constraints.

### O. Content and Media Constraints

Justification: Media validation and advanced formats (e.g., 360 tours) require specialized tooling and storage costs that are outside the project’s resource constraints.

70. The platform does not verify the authenticity of listing photos beyond basic checks.
71. There is no automated moderation for objectionable media beyond admin review.
72. The system does not support 360-degree virtual tours or AR features.
73. Media compression and storage are optimized for web use, not archival quality.

### P. Legal and Policy Constraints

Justification: Legal and compliance features require professional legal review and jurisdiction-specific policies; these are deferred to avoid misrepresentation or invalid guidance.

74. The platform does not provide legal counsel on tenancy disputes or eviction procedures.
75. The system does not generate government compliance reports automatically.
76. Terms of use and privacy policies are generic and may require legal review for production use.
77. The system does not store government-issued IDs beyond what is required for landlord vetting.

### Q. Operational Boundary Conditions

Justification: Operational assumptions are needed to keep the system implementable and testable; full service guarantees and advanced optimization depend on production-grade infrastructure and long-term operations.

78. The system assumes landlord-provided data is accurate and does not enforce independent verification.
79. The platform does not guarantee continuous uptime beyond standard hosting availability.
80. Disaster recovery procedures are limited to standard database backups and not full business continuity planning.
81. The system does not include multilingual localization beyond English and basic Filipino terms.
82. The current version does not support automated lease renewal or dynamic pricing optimization.

### R. Ethics and Responsible Use

Justification: The system avoids high-risk automated decisions and sensitive data collection to reduce potential harm and align with responsible AI practice in a student research context.

83. The platform does not implement automated decision-making that can deny tenants housing.
84. The system does not collect sensitive biometric, medical, or financial credit data.
85. AI outputs are logged for transparency but not used to enforce punitive actions.

### S. Research and Documentation Limits

Justification: Research time is bounded to the academic term, so long-horizon impact assessments and lifecycle studies are outside the intended deliverables.

86. The scope does not cover long-term post-deployment maintenance or version upgrades.
87. The study excludes economic impact analysis on local housing affordability.
88. The system does not quantify landlord revenue uplift or tenant savings as a research outcome.

### T. Future Work Explicitly Excluded

Justification: These items are acknowledged as important but depend on compliance reviews, additional funding, or platform maturity not achievable in the current phase.

89. Integration with payment gateways is deferred to future work pending compliance review.
90. Native mobile applications are not included in the current deliverable.
91. Real-time IoT integrations (smart locks, meters, cameras) are excluded in this phase.
92. Advanced GIS layers, zoning overlays, and cadastral mapping are excluded.
93. Automated legal workflows and eviction tooling are excluded.
94. Multi-city scaling is outside the current research boundary.
95. Automated credit screening and background checks are excluded.
96. Third-party analytics and ad platforms are excluded to reduce privacy risks.

### U. Summary Note

These delimitations are intended to clarify the system boundaries, protect the study from scope creep, and ensure that evaluation remains aligned with the targeted context of Barangay Marulas, Valenzuela City. The exclusions are justifiable based on resource constraints, data access limitations, and the educational capstone setting of the project.

## Item-Specific Justifications (Quick Answers)

1. Reason: Localized scope keeps data collection and validation feasible within the barangay.
2. Reason: Multi-unit rentals share workflows; other property types require different rules and legal handling.
3. Reason: Parcel datasets are costly and not consistently available at city or regional scale.
4. Reason: Demographic profiling adds privacy risk without improving core rental workflows.
5. Reason: Seasonal demand analytics require longitudinal data outside the study timeframe.
6. Reason: Engineering-grade outputs require CAD tooling and professional validation beyond scope.
7. Reason: Irregular geometry increases UI complexity and training burden for typical landlords.
8. Reason: 3D and BIM require specialized pipelines and assets not available to the team.
9. Reason: Code compliance needs certified assessments and regulatory authority.
10. Reason: Campus-scale facilities management is a separate domain with broader integrations.
11. Reason: Auto-actions could trigger incorrect enforcement without human review.
12. Reason: Eviction automation carries legal liability and jurisdiction-specific procedures.
13. Reason: Advanced spatial layers need external data sources and licensing.
14. Reason: Government parcel validation requires authoritative datasets and access approvals.
15. Reason: Navigation requires map routing services and additional API costs.
16. Reason: Real-time traffic data needs third-party APIs and ongoing fees.
17. Reason: Marketplace syndication needs platform agreements and compliance checks.
18. Reason: Voice/video adds bandwidth, moderation, and infrastructure costs.
19. Reason: End-to-end encryption complicates moderation and key management.
20. Reason: Enterprise retention requires legal archiving standards and storage budgets.
21. Reason: SMS/email outreach requires telecom compliance and paid gateways.
22. Reason: User-programmable workflows increase testing and error risk.
23. Reason: Notarization requires accredited third parties and legal partnerships.
24. Reason: Enforceability depends on legal review not available to the team.
25. Reason: Jurisdictional clauses vary and require legal customization.
26. Reason: Legal disputes require formal processes beyond platform capability.
27. Reason: Automated redlining is complex and needs legal approval workflows.
28. Reason: Fund transfers trigger compliance and security obligations.
29. Reason: Payment gateways require KYC/AML and contractual onboarding.
30. Reason: OCR fraud checks need dataset training and higher risk controls.
31. Reason: Tax workflows vary by authority and require certified accounting.
32. Reason: Multi-currency adds FX handling and regulatory complexity.
33. Reason: Audited accounting requires stricter controls than a prototype.
34. Reason: Auto-assigning vendors needs contracted service networks.
35. Reason: Procurement and inventory are separate operational systems.
36. Reason: Optimization algorithms require staff data and routing APIs.
37. Reason: External facilities tools require integrations and licensing.
38. Reason: Compliance schedules need regulatory data and legal accountability.
39. Reason: AI recommendations can be wrong; human review limits risk.
40. Reason: Budget approval is a financial decision with liability.
41. Reason: Live web sources introduce quality, privacy, and licensing issues.
42. Reason: Legal advice is regulated and outside academic scope.
43. Reason: Credit checks require access to sensitive data and legal consent.
44. Reason: Document presence checks are feasible; authenticity checks are not.
45. Reason: Authenticity verification needs government databases and authority.
46. Reason: Full audits require regulatory frameworks and certified auditors.
47. Reason: Licensing renewals are legal obligations beyond platform control.
48. Reason: Legal arbitration exceeds platform governance scope.
49. Reason: Military-grade security is disproportionate to project resources.
50. Reason: On-prem deployments require enterprise infrastructure and support.
51. Reason: Offline-first demands complex sync and conflict resolution.
52. Reason: SIEM and DLP are enterprise tools with high setup cost.
53. Reason: Automated anonymization needs advanced pipelines and review.
54. Reason: Biometrics raise privacy, compliance, and device constraints.
55. Reason: Native apps require separate development and maintenance tracks.
56. Reason: Legacy browsers limit modern feature use and test coverage.
57. Reason: Low-end performance optimization needs extensive profiling.
58. Reason: Native push needs app-level integration not in web-only scope.
59. Reason: Marketplace APIs require approval and ongoing compliance.
60. Reason: Government data access is restricted and not publicly exposed.
61. Reason: Public APIs expand support needs and security surface area.
62. Reason: Data warehousing demands ETL pipelines and governance.
63. Reason: Predictive models require long-term historical data.
64. Reason: Real-time BI needs streaming pipelines and additional infra.
65. Reason: External data blending needs contracts and data governance.
66. Reason: Large-scale tests require participants and budget not available.
67. Reason: City-scale load tests require production-level infrastructure.
68. Reason: Pen testing requires certified security professionals.
69. Reason: Certifications are costly and time-intensive.
70. Reason: Photo verification needs manual review or ML moderation.
71. Reason: Automated media moderation needs trained models and legal policy.
72. Reason: 360 and AR require specialized capture and rendering pipelines.
73. Reason: Archival storage increases cost with limited study benefit.
74. Reason: Legal counsel must be provided by licensed professionals.
75. Reason: Compliance reporting needs formal legal frameworks.
76. Reason: Policies require legal review not covered by the study.
77. Reason: ID storage increases risk and compliance requirements.
78. Reason: Data verification depends on external sources not accessible.
79. Reason: Uptime guarantees need enterprise hosting and SLAs.
80. Reason: Full continuity planning requires operational funding.
81. Reason: Localization needs translation and cultural validation.
82. Reason: Automated renewals and pricing need analytics and regulatory review.
83. Reason: Automated denial decisions can create fairness and legal risk.
84. Reason: Sensitive data collection raises privacy and compliance issues.
85. Reason: AI should inform, not enforce, to maintain accountability.
86. Reason: Long-term maintenance exceeds academic time horizon.
87. Reason: Economic impact studies need broader datasets and methods.
88. Reason: Financial impact metrics require longitudinal measurements.
89. Reason: Payments depend on compliance review and gateway onboarding.
90. Reason: Native apps require additional funding and development time.
91. Reason: IoT integrations require hardware access and maintenance.
92. Reason: Advanced GIS needs licensed datasets and specialized tooling.
93. Reason: Legal automation carries high liability and complexity.
94. Reason: Multi-city scaling needs larger operational infrastructure.
95. Reason: Screening requires legal consent and third-party data access.
96. Reason: Ad and analytics platforms add privacy and consent burdens.
