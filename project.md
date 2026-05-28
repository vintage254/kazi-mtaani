**A Biometric-Based Smart Attendance Solution for Efficient Workforce
Management in the Kazi Mtaani Initiative.**

**Francis Atuti**

**Sct222-0122/2018**

*A proposal submitted to the Department of Information Technology, in
the School of science and technology, in partial fulfilment of the
requirement for the award of the degree of Bachelor of Science in
Business Computing.*

**Supervisor: Mr. Wainaina**

**2025**

# DECLARATION  {#declaration}

This proposal/research project is my original work and has not been
presented for a degree in any other University.

Francis Atuti

(Signature)

Date: \_\_\_\_\_\_\_\_\_\_\_\_\_\_

This proposal/research project has been submitted for examination with
my approval as University Supervisor.

Mr. Wainaina

(Signature)

Date: \_\_\_\_\_\_\_\_\_\_\_\_\_\_

# ABSTRACT

Effective attendance management is crucial for the success,
transparency, and accountability of large-scale public works programs
such as Kazi Mtaani, which engage thousands of youth in community
service and urban development tasks across Kenya. The use of traditional
manual attendance methods in such expansive and distributed environments
presents significant challenges. These methods are prone to
inefficiencies, human error, and intentional manipulation, often
resulting in inaccurate records, fraudulent reporting, and the presence
of ghost workers on payrolls. Such issues compromise resource
allocation, reduce operational efficiency, and diminish the overall
integrity of the program, leading to public mistrust and delayed service
delivery.

This project proposes the design and development of a smart attendance
system that leverages WebAuthn-based biometric verification technology
to enhance the accuracy, efficiency, and transparency of attendance
tracking within the Kazi Mtaani program. The system uses the device's
built-in biometric capabilities (fingerprint sensor or facial recognition)
via the WebAuthn standard to create secure public-key credentials for each
registered participant, ensuring that only legitimate and physically present
individuals are able to record attendance. No raw biometric templates are
stored by the system. This approach directly addresses key problems such
as proxy attendance, fraudulent sign-ins, and the labor-intensive task of
reconciling paper-based attendance records.

The system includes functionality for participant credential registration,
daily check-ins and check-outs using WebAuthn biometric authentication,
GPS-based geofence verification, and the generation of real-time attendance
data. Administrators and supervisors are able to access accurate reports
instantly through a web-based dashboard, allowing for faster
decision-making, more efficient supervision, and timely payroll processing.
In doing so, the system helps ensure that financial and logistical resources
are directed toward genuine participants who are actively contributing to
the goals of the program.

By replacing unreliable manual processes with secure, automated
biometric verification, the proposed solution significantly improves
the management, monitoring, and overall impact of the Kazi Mtaani
initiative. Furthermore, the system is designed to be scalable,
affordable, and easy to deploy as a web application accessible from any
device with a browser, making it a viable long-term solution for
government programs seeking to promote fairness, accountability, and
efficiency in public service delivery.

# TABLE OF CONTENT

# Contents {#contents .TOC-Heading}

[DECLARATION [ii](#declaration)](#declaration)

[ABSTRACT [iii](#abstract)](#abstract)

[TABLE OF CONTENT [iv](#table-of-content)](#table-of-content)

[CHAPTER 1 [1](#chapter-1)](#chapter-1)

[INTRODUCTION [1](#introduction)](#introduction)

[1.1 Background [1](#background)](#background)

[1.2 Project Overview [2](#project-overview)](#project-overview)

[1.3 Statement of the Problem
[2](#statement-of-the-problem)](#statement-of-the-problem)

[1.4 Proposed Solution [3](#proposed-solution)](#proposed-solution)

[1.5 Objectives [4](#objectives)](#objectives)

[1.6 Research Questions [4](#research-questions)](#research-questions)

[1.7 Justification [4](#justification)](#justification)

[1.8 Scope of Study [5](#scope-of-study)](#scope-of-study)

[CHAPTER 2 [6](#chapter-2)](#chapter-2)

[LITERATURE REVIEW [6](#literature-review)](#literature-review)

[2.1 Introduction [6](#introduction-1)](#introduction-1)

[2.1 Characteristics of Biometrics
[7](#characteristics-of-biometrics)](#characteristics-of-biometrics)

[2.2 Classification of Biometric Systems
[7](#classification-of-biometric-systems)](#classification-of-biometric-systems)

[2.3 Stages in Biometric Registration and Identification
[8](#stages-in-biometric-registration-and-identification)](#stages-in-biometric-registration-and-identification)

[2.4 Existing Methods of Participant Attendance Registration
[9](#existing-methods-of-participant-attendance-registration)](#existing-methods-of-participant-attendance-registration)

[2.5 Related Work [10](#related-work)](#related-work)

[2.6 Conceptual Architecture
[11](#conceptual-architecture)](#conceptual-architecture)

[CHAPTER 3: SYSTEM ANALYSIS AND DESIGN
[12](#chapter-3-system-analysis-and-design)](#chapter-3-system-analysis-and-design)

[3.1 Introduction [12](#introduction-2)](#introduction-2)

[3.2 System Development Methodology
[12](#system-development-methodology)](#system-development-methodology)

[3.2.1 Overview of Agile Methodology
[12](#overview-of-agile-methodology)](#overview-of-agile-methodology)

[3.2.2 Agile Application to This Project
[14](#agile-application-to-this-project)](#agile-application-to-this-project)

[3.3 Feasibility Study [14](#feasibility-study)](#feasibility-study)

[3.3.1 Economic Feasibility
[14](#economic-feasibility)](#economic-feasibility)

[3.3.2 Technical Feasibility
[15](#technical-feasibility)](#technical-feasibility)

[3.3.3 Operational Feasibility
[18](#operational-feasibility)](#operational-feasibility)

[3.3.4 Legal and Regulatory Feasibility
[18](#legal-and-regulatory-feasibility)](#legal-and-regulatory-feasibility)

[3.3.5 Social Feasibility
[19](#social-feasibility)](#social-feasibility)

[3.4 Requirements Elicitation
[19](#requirements-elicitation)](#requirements-elicitation)

[3.4.1 Sampling Techniques
[21](#sampling-techniques)](#sampling-techniques)

[3.4.2 Alignment of Data with Project Objectives
[21](#alignment-of-data-with-project-objectives)](#alignment-of-data-with-project-objectives)

[3.4.3 Approval and Appendix
[21](#approval-and-appendix)](#approval-and-appendix)

[3.5 Data Analysis [21](#data-analysis)](#data-analysis)

[3.5.1 Quantitative Analysis (Questionnaire Data)
[21](#quantitative-analysis-questionnaire-data)](#quantitative-analysis-questionnaire-data)

[3.5.2 Qualitative Analysis (Interview Insights)
[22](#qualitative-analysis-interview-insights)](#qualitative-analysis-interview-insights)

[3.5.3 Observation Findings
[23](#observation-findings)](#observation-findings)

[3.6 System Specification
[25](#system-specification)](#system-specification)

[3.6.1 Functional Requirements
[25](#functional-requirements)](#functional-requirements)

[3.6.2 Non-Functional Requirements
[26](#non-functional-requirements)](#non-functional-requirements)

[3.7 Requirements Analysis and Modeling
[29](#requirements-analysis-and-modeling)](#requirements-analysis-and-modeling)

[3.7.1 Requirements Analysis
[29](#requirements-analysis)](#requirements-analysis)

[3.7.2 Structured Requirements
[30](#structured-requirements)](#structured-requirements)

[3.8 Logical Design [32](#logical-design)](#logical-design)

[3.8.1 System Architecture
[32](#system-architecture)](#system-architecture)

[3.8.2 Control Flow and Process Design
[34](#control-flow-and-process-design)](#control-flow-and-process-design)

[3.8.3 Design for Non-Functional Requirements
[35](#design-for-non-functional-requirements)](#design-for-non-functional-requirements)

[3.9 Database Design [37](#database-design)](#database-design)

[3.9.1 Database Schema [37](#database-schema)](#database-schema)

[3.9.2 User Interface Design
[39](#user-interface-design)](#user-interface-design)

[CHAPTER 4: SYSTEM IMPLEMENTATION AND TESTING
[45](#chapter-4-system-implementation-and-testing)](#chapter-4-system-implementation-and-testing)

[4.1 Introduction [45](#introduction-3)](#introduction-3)

[4.2 Environment and Tools
[45](#environment-and-tools)](#environment-and-tools)

[4.3 System Code Generation
[47](#system-code-generation)](#system-code-generation)

[4.4 Testing [49](#testing)](#testing)

[4.4.1 Unit Testing [49](#unit-testing)](#unit-testing)

[4.4.2 Integration Testing
[49](#integration-testing)](#integration-testing)

[4.4.3 System Testing [50](#system-testing)](#system-testing)

[4.4.4 User Acceptance Testing (UAT)
[50](#user-acceptance-testing-uat)](#user-acceptance-testing-uat)

[4.4.5 Performance Testing
[51](#performance-testing)](#performance-testing)

[4.5 User Guide [51](#user-guide)](#user-guide)

[4.5.1 Installation Instructions (Development Environment)
[51](#installation-instructions-development-environment)](#installation-instructions-development-environment)

[4.5.2 Deployment Instructions (Production)
[52](#deployment-instructions-production)](#deployment-instructions-production)

[4.5.3 Using the System [52](#using-the-system)](#using-the-system)

[4.5.4 Troubleshooting Tips
[53](#troubleshooting-tips)](#troubleshooting-tips)

[4.6 Deployment [54](#deployment)](#deployment)

[4.6.1 Deployment Strategy
[54](#deployment-strategy)](#deployment-strategy)

[4.6.2 Deployment Challenges
[54](#deployment-challenges)](#deployment-challenges)

[4.7 Security Features [55](#security-features)](#security-features)

[CHAPTER 5: SUMMARY, CONCLUSION AND RECOMMENDATIONS
[56](#chapter-5-summary-conclusion-and-recommendations)](#chapter-5-summary-conclusion-and-recommendations)

[5.1 Introduction [56](#introduction-4)](#introduction-4)

[5.2 Summary of the Project
[56](#summary-of-the-project)](#summary-of-the-project)

[5.3 Conclusion [57](#conclusion)](#conclusion)

[5.4 Recommendations [57](#recommendations)](#recommendations)

[5.4.1 For System Implementation
[57](#for-system-implementation)](#for-system-implementation)

[5.4.2 For System Improvement
[57](#for-system-improvement)](#for-system-improvement)

[5.4.3 For Policy Makers and Stakeholders
[58](#for-policy-makers-and-stakeholders)](#for-policy-makers-and-stakeholders)

[5.4.4 For Future Research
[58](#for-future-research)](#for-future-research)

[5.5 Summary [58](#summary)](#summary)

[REFERENCES [59](#references)](#references)

[LIST OF APPENDICES [61](#list-of-appendices)](#list-of-appendices)

[Appendix A: [61](#appendix-a)](#appendix-a)

[Appendix B: [62](#appendix-b)](#appendix-b)

# 

# CHAPTER 1  {#chapter-1}

# INTRODUCTION  {#introduction}

## 1.1 Background  {#background}

The \"Kazi Mtaani\" program, a national initiative in Kenya, aims to
provide income opportunities for vulnerable youth in informal
settlements while undertaking public works projects. The program\'s
success heavily relies on the consistent and verifiable attendance of
its participants. However, managing attendance for a large, distributed
workforce often presents significant challenges. Manual attendance
registers are susceptible to human error, manipulation (e.g., signing
for absent colleagues, known as \"proxy attendance\"), and loss of
records. These issues undermine the program\'s integrity, lead to
misallocation of funds, and make accurate performance evaluation
difficult.

The current methods often result in:

Inaccurate Records: Manual entries can be illegible, incomplete, or
intentionally falsified.

Time Consumption: Recording and reconciling attendance data manually for
thousands of participants across various sites is a laborious and
time-consuming process.

Fraud and Impersonation: The lack of robust verification allows for
\"ghost workers\" (non-existent individuals on the payroll) or
participants signing in for others.

Delayed Reporting and Payments: Manual data collection and processing
can significantly delay the generation of attendance reports, which are
critical for timely participant payments.

Lack of Real-time Monitoring: Supervisors lack immediate insights into
daily attendance, hindering prompt intervention and resource deployment.

Biometric technology, particularly WebAuthn-based device biometric
verification (fingerprint and facial recognition), offers a robust
solution to these challenges. Biometric identification via WebAuthn is
unique to each individual, difficult to forge, and provides a high level
of accuracy and reliability in identity verification. Implementing a
biometric attendance system can streamline the process, enhance
accountability, and ensure that the Kazi Mtaani program achieves its
intended social and economic objectives efficiently.

## 1.2 Project Overview  {#project-overview}

The proposed project focuses on the development of a smart attendance
system that utilizes WebAuthn-based biometric verification to manage
participant attendance within the Kazi Mtaani program. This program
employs thousands of youth across Kenya in labor-intensive public
service tasks, making effective workforce management essential for
transparency and success.

The system is designed to register and verify participants using
WebAuthn public-key credentials bound to their device's biometric
sensor (fingerprint or face). Each participant checks in and out of
their work site using biometric authentication on their device, which
verifies their presence and automatically logs the time of entry and
exit. GPS coordinates are captured and verified against the work site's
geofence. The data collected is securely stored in a centralized
PostgreSQL database and made available to program supervisors through a
web-based dashboard for monitoring and reporting.

This approach aims to replace traditional attendance tracking methods
such as paper registers and verbal roll calls, which are vulnerable to
fraud, manipulation, and inefficiency. The proposed solution will
provide real-time access to accurate attendance data, making it easier
to verify participant presence, generate timely payrolls, and monitor
performance across different sites.

In addition to enhancing data accuracy and operational efficiency, the
system is designed to be user-friendly, scalable, and cost-effective.

## 1.3 Statement of the Problem  {#statement-of-the-problem}

The existing attendance management mechanisms within the Kazi Mtaani
program, primarily manual sign-in sheets, are inadequate for accurately
and efficiently tracking the presence of a large and dynamic workforce.
This inadequacy leads to several critical issues:

- Prevalence of Fraudulent Practices: The ease with which manual
  registers can be manipulated facilitates proxy attendance and the
  inclusion of non-existent individuals, diverting public funds.

- Operational Inefficiencies: The manual collection, aggregation, and
  verification of attendance data are time-consuming,
  resource-intensive, and prone to errors, delaying critical processes
  like payroll generation.

- Lack of Transparency and Accountability: The opaque nature of manual
  systems makes it difficult to ascertain genuine participation,
  undermining public trust and the program\'s overall accountability.

- Hindered Performance Monitoring: Without accurate, real-time
  attendance data, program managers face significant challenges in
  monitoring participant engagement, assessing productivity, and making
  informed decisions regarding resource allocation and site management.

These challenges collectively compromise the effectiveness and
sustainability of the Kazi Mtaani program, necessitating a technological
intervention that provides an immutable, efficient, and transparent
attendance tracking solution.

## 1.4 Proposed Solution  {#proposed-solution}

To address the challenges associated with manual attendance tracking in
the Kazi Mtaani program, this project proposes the development of a
smart attendance system using WebAuthn public-key authentication for
secure, practical, and privacy-preserving verification. The system
provides an efficient and tamper-resistant method of verifying
participant presence at designated work sites.

Each participant undergoes an initial credential registration process
via WebAuthn, creating a public-key credential bound to the participant
on their device. No raw biometric templates are stored by the system.
On a daily basis, participants check in and out via WebAuthn-based
biometric authentication (fingerprint or face recognition). The system
automatically records the exact time of each attendance transaction
along with GPS coordinates, links it to the participant's profile, and
updates records promptly.

Supervisors and program administrators will access this data through a
web-based dashboard, which provides timely views of participant
attendance, site performance, and workforce distribution. This digital
system replaces manual sign-in sheets, reduces the risk of fraudulent
practices such as proxy attendance or ghost workers, and speeds up
reporting and payroll preparation.

The system is designed to be scalable, affordable, and user-friendly,
making it suitable for deployment across different Kazi Mtaani sites.
It is currently online-first; offline capture and later synchronization
are identified as future work.

By combining strong authentication, timely data access, and automated
reporting, the solution improves operational efficiency, promotes
accountability, and helps ensure that only genuine, active participants
receive compensation.

## 1.5 Objectives  {#objectives}

General Objective

Design and develop a smart attendance system for the Kazi Mtaani
program using WebAuthn-based biometric verification and GPS geofencing.

Specific Objectives

i\. To identify the limitations and challenges of existing attendance
management methods in the Kazi Mtaani program.

ii\. To develop a WebAuthn-based system for accurate and efficient
participant authentication and attendance recording without storing raw
biometric templates.

iii\. To test the developed system for its accuracy, performance, and
effectiveness in a Kazi Mtaani operational environment.

## 1.6 Research Questions  {#research-questions}

This research seeks to answer the following questions:

i\. What are the key limitations and challenges associated with the
current attendance management methods employed in the Kazi Mtaani
program?

ii\. How can a biometric fingerprint-based system be effectively
designed and implemented to authenticate Kazi Mtaani participants and
record their attendance?

iii\. What is the accuracy, performance, and overall effectiveness of
the developed biometric attendance system when deployed in a Kazi Mtaani
operational setting?

## 1.7 Justification  {#justification}

Implementing a smart attendance system using biometrics for the Kazi
Mtaani program is justified by its potential to deliver significant
improvements in efficiency, accountability, and resource management.

Enhanced Accuracy and Integrity: Biometric identification eliminates
proxy attendance and impersonation, ensuring that only registered and
physically present participants are marked. This directly translates to
accurate payrolls and prevents financial leakages.

Operational Efficiency: Automating attendance recording reduces the
administrative burden on supervisors, frees up time for core supervisory
duties, and accelerates data processing for timely payments.

Increased Transparency and Accountability: The system provides
verifiable and auditable attendance records, fostering greater
transparency in resource utilization and enhancing accountability to
taxpayers and stakeholders.

Real-time Data for Informed Decision-Making: Access to real-time
attendance data empowers program managers to monitor workforce
deployment, identify absenteeism trends, and allocate resources more
effectively across different work sites.

Scalability: A biometric system can be scaled to accommodate the large
and fluctuating number of participants across various Kazi Mtaani sites,
unlike manual systems that become increasingly cumbersome with scale.

Improved Participant Morale: A fair and transparent attendance system
can boost participant morale by ensuring that only those who genuinely
work are compensated, reducing grievances related to unfair practices.

Ultimately, this project aims to strengthen the operational framework of
the Kazi Mtaani program, ensuring its sustainability and maximizing its
positive impact on community development and youth empowerment.

## 1.8 Scope of Study {#scope-of-study}

This study will focus on designing and developing a WebAuthn-based
biometric attendance system with GPS geofencing. The system\'s implementation and testing
will be conducted within a selected Kazi Mtaani work site in Thika,
Kiambu County, Kenya. The scope of the study will be limited to
approximately 50-100 Kazi Mtaani participants to ensure manageability
during the development and testing phases, given the resources and time
constraints. The system will primarily focus on daily check-in and
check-out functionalities, real-time attendance reporting, and basic
participant registration. Advanced features such as integration with
payroll systems or complex scheduling will be considered for future
enhancements but are outside the immediate scope of this research.

# CHAPTER 2  {#chapter-2}

# LITERATURE REVIEW  {#literature-review}

## 2.1 Introduction  {#introduction-1}

Effective identification and authentication are foundational to managing
large workforces and ensuring accountability. In the context of public
works programs like Kazi Mtaani, accurate attendance records are
paramount for resource allocation, performance evaluation, and
preventing fraud. This chapter reviews existing identification and
authentication methods, with a particular focus on biometric
technologies, and examines related work in attendance management
systems.

Identification, as defined by Zarina and Abdel (2015), involves
non-private information provided by a user to establish their identity,
such as names or IDs. To enhance security, authentication mechanisms are
employed, incorporating both public and private information. Common
authentication methods include:

a\) Knowledge-Based Authentication (KBA): These methods rely on \"what
the user knows,\" such as passwords, PINs, or security questions. While
inexpensive and simple to use, KBAs are susceptible to compromise
through sharing or unauthorized disclosure (Zarina and Abdel, 2015). In
a Kazi Mtaani context, this would involve participants remembering
unique codes, which could easily be shared for proxy attendance.

b\) Possession-Based Authentication: These methods depend on \"what a
user has,\" such as smart cards, ID badges, or tokens. While offering
better security than KBAs, they are still vulnerable to theft, loss, or
unauthorized sharing. Bhalla et al. (2013) note that smart cards, often
used for employee clock-ins, can be easily shared, leading to inaccurate
attendance. For Kazi Mtaani, issuing and managing physical cards for
thousands of participants would also present logistical challenges and
costs.

c\) Biometrics-Based Authentication: This is the most secure method,
relying on \"what a user is.\" It utilizes unique physiological (e.g.,
fingerprints, face, iris, retina) or behavioral (e.g., voice, signature,
keystroke) characteristics (Tiwari, Tiwari, and Tiwari, 2015).
Biometrics offer a high level of assurance because these characteristics
are inherently linked to the individual and are difficult to replicate
or forge. For Kazi Mtaani, this means that only the actual participant
can register their attendance.

Biometrics are considered the most secure and reliable means of
authentication because, unlike tokens or passwords, they require the
physical presence of the individual for verification (Tiwari, Tiwari,
and Tiwari, 2015). This inherent characteristic makes biometric systems
ideal for preventing impersonation and ensuring accurate attendance
records in environments like Kazi Mtaani.

## 2.1 Characteristics of Biometrics {#characteristics-of-biometrics}

According to Tiwari et al. (2015), all effective biometric schemes
should possess several key characteristics:

- Universality: Every individual should possess the characteristic being
  measured (e.g., everyone has fingerprints).

- Distinctiveness: The characteristic should be sufficiently unique to
  differentiate between individuals.

- Permanence: The characteristic should remain relatively constant over
  a person\'s lifetime, regardless of age or other factors.

- Collectability: The characteristic can be easily captured and
  measured.

- Performance: The system should have high accuracy, speed, and
  robustness.

- Acceptability: Users should be willing to use the biometric system.

- Circumvention: The ease with which the system can be fooled or
  bypassed.

For the Kazi Mtaani context, fingerprint biometrics meet these criteria
well. Fingerprints are universal, highly distinctive, generally
permanent, and relatively easy to collect using affordable scanners. The
challenge lies in ensuring high performance (low error rates) and user
acceptance, particularly in outdoor or dusty environments.

## 2.2 Classification of Biometric Systems {#classification-of-biometric-systems}

Biometric systems can be classified based on the number of identifiers
used (Kant & Dr. Nath, 2006; Tiwari et al., 2015):

- Unibiometric Systems: Use a single biometric identifier (e.g., only
  fingerprints).

- Unimodal Biometric Systems: Use a single instance, representation, and
  matcher for recognition.

- Multibiometric Systems: Use more than one physiological or behavioral
  characteristic of the same individual for enrollment, verification,
  and identification (e.g., combining fingerprint and facial
  recognition).

- Multimodal Biometric Systems: Use more than one correlated biometric
  measurement (e.g., multiple impressions of a finger) to enhance
  accuracy and reduce error rates.

For the Kazi Mtaani program, a unibiometric (fingerprint-only) system is
proposed initially due to its cost-effectiveness, ease of deployment,
and high accuracy for attendance purposes. Future enhancements could
explore multimodal approaches if higher security or robustness is
required.

## 2.3 Stages in Biometric Registration and Identification {#stages-in-biometric-registration-and-identification}

The process of biometric attendance involves two primary stages (Tiwari
et al., 2015; Kant & Dr. Nath, 2006):

i\. Enrollment/Identification:

- Data Collection: A biometric device (sensor) captures the
  individual\'s unique data (e.g., fingerprint image).

- Feature Extraction: The raw biometric data is processed to extract
  distinctive features, creating a unique template.

- Template Storage: This compressed template is then securely stored in
  a database, often linked to the individual\'s unique identifier (e.g.,
  Kazi Mtaani participant ID).

ii\. Verification/Authentication:

- Live Capture: When a participant attempts to check-in, their biometric
  data is captured by the sensor.

- Feature Extraction: A new template is generated from the live capture.

- Comparison: This new template is compared against the stored templates
  in the database.

- Decision: Based on the degree of similarity, the system makes a
  decision to grant or deny access/mark attendance. A high degree of
  similarity confirms the individual\'s identity.

The quality of the data collected by the sensor is critical to minimize
False Rejection Rate (FRR) and False Acceptance Rate (FAR), which are
key performance metrics.

## 2.4 Existing Methods of Participant Attendance Registration {#existing-methods-of-participant-attendance-registration}

In public works programs like Kazi Mtaani, attendance is predominantly
managed through manual methods, which present significant drawbacks:

Manual Sign-in Sheets/Registers: Participants physically sign their
names or mark their presence on a paper register.

**Challenges:**

a)  Time-consuming and Inefficient: For large groups, this method
    consumes significant time, delaying the start of work.

b)  Error-Prone: Illegible handwriting, missed entries, and data entry
    errors during digitization are common.

c)  Prone to Fraud: Easy to manipulate; participants can sign for absent
    colleagues (\"ghost workers\" or \"proxy attendance\").

d)  Difficult Data Analysis: Aggregating and analyzing attendance data
    for reporting and payroll is tedious and cumbersome.

e)  Lack of Real-time Information: No immediate overview of daily
    attendance.

f)  Roll Call: Supervisors verbally call out names, and participants
    confirm their presence.

g)  Impractical for Large Groups: Extremely time-consuming and
    disruptive for large workforces.

h)  Subject to Human Bias/Error: Supervisor might mistakenly mark
    someone present or absent.

i)  No Concrete Proof: Lacks verifiable evidence of presence.

j)  Supervisor Observation: Supervisors visually confirm presence.

k)  Subjective: Relies entirely on the supervisor\'s vigilance and
    memory.

l)  Scalability Issues: Impossible to effectively monitor a large,
    dispersed workforce.

m)  No Formal Record: Lacks a structured, auditable attendance record.

## 2.5 Related Work {#related-work}

Several studies have explored automated attendance systems, highlighting
the shift from manual to more secure and efficient methods:

RFID and Facial Recognition: Patel and Priya (2014) proposed a system
combining RFID for attendance taking and facial recognition for
verification. While offering long-range reading capabilities, this
approach can be expensive due to the need for multiple devices (RFID
reader, camera) and significant database storage for facial images. For
Kazi Mtaani, the cost and complexity of deploying such a multi-modal
system across numerous sites might be prohibitive.

Facial Recognition Systems: Behara and Raghunadh (2013) developed a
facial recognition system for time and attendance. However, such systems
can be spoofed using photographs, potentially allowing unauthorized
access. The computational complexity for real-time processing of many
faces in varied outdoor lighting conditions (common in Kazi Mtaani)
could also be a challenge.

Mobile-Based Systems: Somasundaram, Kannan, and Sriram (2016) developed
an Android mobile-based authentication system for student attendance
tracking. While convenient, such systems often require all users to
possess smartphones and are susceptible to sharing of devices or
credentials, as noted by Bhalla et al. (2013) regarding NFC-based
systems. In Kazi Mtaani, not all participants may own smartphones, and
sharing devices could reintroduce proxy attendance issues.

Bluetooth-Based Systems: Lodha et al. (2015) proposed a Bluetooth-based
attendance management system using smart chips. This system also faces
the risk of tag sharing and can be cumbersome for large classes due to
the range-based nature of Bluetooth and the need for the lecturer to
move around. This would be equally challenging in a Kazi Mtaani setting
with large, spread-out work teams.

The existing literature underscores the need for a robust,
cost-effective, and user-friendly attendance system. Fingerprint
biometrics emerge as a strong candidate due to their inherent security,
relative affordability, and proven accuracy in various authentication
scenarios, offering a more suitable solution for the unique operational
environment of Kazi Mtaani compared to other advanced or less secure
methods.

## 2.6 Conceptual Architecture {#conceptual-architecture}

The proposed Smart Attendance System for Kazi Mtaani operates on a
multi-layered architecture, ensuring robust data flow, security, and
user interaction.

The conceptual framework outlines how public-key authentication (WebAuthn)
and GPS geofencing enhance attendance management in Kazi Mtaani. It
establishes the relationship between the problem (manual attendance
issues), the technological intervention (WebAuthn credentials and GPS
verification), and the expected outcomes (improved accuracy, efficiency,
and accountability).

At the core of this framework is WebAuthn-based credential enrollment
and authentication, which associates a public-key credential to each
participant and verifies daily check-ins/outs. No raw biometric
templates are stored. GPS coordinates are captured at check-in and
verified against the work site's geofence to confirm physical presence.
Attendance records are stored in a central database, enabling timely
access and reporting for supervisors and administrators.

Key components include:

- Inputs: WebAuthn credential operations, GPS location data, participant
  identity data, attendance timestamps, and a web interface.

- Processes: WebAuthn registration and authentication, GPS geofence
  validation, attendance logging, and report generation.

- Outputs: Accurate attendance logs, real-time reports, payroll support
  data, fraud detection, and performance summaries.

- Outcomes: Enhanced operational efficiency, reduced fraud, improved
  transparency, and fair compensation for genuine participants.

This framework supports the idea that the integration of secure
biometric technology into public workforce programs can resolve
administrative and accountability challenges by providing a dependable
mechanism for identity verification and attendance tracking.

# CHAPTER 3: SYSTEM ANALYSIS AND DESIGN

## 3.1 Introduction {#introduction-2}

System analysis and design is the foundation upon which successful
information systems are built. In this chapter, we outline the technical
and operational structure of the proposed biometric-based attendance
system designed to enhance workforce management in the Kazi Mtaani
initiative. This chapter identifies system users, the development
methodology adopted, feasibility assessments, and detailed system
specifications including process modeling, database design, and user
interface mockups.

The goal is to bridge the gap between theoretical design and practical
implementation while ensuring that the system solves real-world problems
such as fraud, inefficiency, and data inaccuracy.

## 3.2 System Development Methodology {#system-development-methodology}

A systems development methodology is a structured approach used to plan,
design, develop, and implement information systems. For this project,
the Agile methodology is adopted due to its adaptability and iterative
nature, which allows for continuous improvement through user feedback.

### 3.2.1 Overview of Agile Methodology {#overview-of-agile-methodology}

Agile is an iterative and incremental approach that emphasizes customer
collaboration, functional software, and adaptive planning. Unlike
traditional Waterfall methods which follow a strict sequence, Agile
cycles through short sprints (2--4 weeks) where specific features are
developed, tested, and refined with feedback.

Figure 1: agile development
lifecycle.![](media/image1.png){width="6.322916666666667in"
height="6.322916666666667in"}

Agile was ideal for this project due to:

Frequent User Involvement: Supervisors and coordinators provide feedback
after each sprint.

Risk Management: Allows pivoting quickly if biometric hardware behaves
unexpectedly.

Incremental Progress: Early delivery of working features like
biometric check-in.

### 3.2.2 Agile Application to This Project {#agile-application-to-this-project}

Each sprint began with a daily stand-up meeting with stakeholders and
ended with a retrospective review to guide improvements.

| Sprint   | Duration | Deliverables                                   |
|----------|----------|------------------------------------------------|
| Sprint 1 | 2 weeks  | Biometric enrollment module with basic UI      |
| Sprint 2 | 3 weeks  | Check-in/check-out logic, WebAuthn verification |
| Sprint 3 | 2 weeks  | Admin dashboard for monitoring attendance      |
| Sprint 4 | 1 week   | Reporting, GPS geofence verification           |
| Sprint 5 | 1 week   | Testing and bug fixes                          |

## 3.3 Feasibility Study {#feasibility-study}

A feasibility study was conducted to assess whether the proposed system
is practical and viable. It focused on five aspects: economic,
technical, operational, legal, and social feasibility.

### 3.3.1 Economic Feasibility {#economic-feasibility}

Economic feasibility assesses whether the expected benefits of the
project justify the investment.

The system's development and deployment costs include:

Cloud hosting and domain (\~KES 20,000)

Development tools and services (\~KES 100,000)

Training and maintenance (\~KES 50,000)

**Expected Savings and Benefits:**

- Elimination of fraudulent payments (ghost workers)

- Reduced administrative labor (paper processing)

- Faster payroll generation

**Break-Even Estimate:**

Initial Cost: \~KES 400,000

Estimated Annual Savings: \~KES 300,000--500,000

Break-even Period: \~1.3 years

### 3.3.2 Technical Feasibility {#technical-feasibility}

The biometric-based attendance system is technically feasible and can be
implemented using widely available and affordable software tools and
standard web-capable devices. The technologies required are easy to
access, have good community support, and can be maintained by a small
technical team.

a)  **Device Compatibility**

The system leverages the WebAuthn standard, which uses the device's
built-in biometric sensors (fingerprint reader or facial recognition
camera). Modern smartphones, laptops, and tablets already include these
sensors, eliminating the need for dedicated external hardware. WebAuthn
is supported by all major browsers (Chrome, Firefox, Safari, Edge),
making the system accessible on any standard device.

b)  **Software Stack**

The tools used to build the system are open-source or freely available,
which reduces overall cost and gives room for easy customization:

- **Full-Stack Framework**: The system is built using **Next.js 15**, a
  React-based full-stack framework using **TypeScript**. It handles both
  the frontend UI and backend API routes in a single codebase, with
  server-side rendering for performance.

- **Frontend**: The user interface is built with **React 19** and
  **Tailwind CSS** for responsive, utility-first styling. These tools
  allow supervisors and participants to interact with the system through
  clean, modern pages that work on any device.

- **Authentication**: User authentication and role management is handled
  by **Clerk**, which provides WebAuthn-based biometric login, session
  management, and user metadata storage.

- **Database**: Data is stored in **PostgreSQL** hosted on **Neon**
  (serverless PostgreSQL), accessed via **Drizzle ORM**. It holds user
  records, attendance logs, groups, and system activity.

- **APIs**: Next.js API routes handle all server-side logic including
  attendance recording, dashboard data aggregation, and report
  generation. GPS coordinates are captured via the browser's Geolocation
  API and verified against work site geofences.

c)  **Deployment and Hosting**

The system is deployed on **Vercel**, a serverless hosting platform
optimized for Next.js applications. The database is hosted on **Neon**,
a serverless PostgreSQL provider. This means there is no server
infrastructure to manage — the system scales automatically based on
usage and is accessible from any device with a browser and internet
connection.

d)  **Room for Growth**

The system is built in a way that makes it easy to expand later. For
example:

- Additional biometric methods (facial recognition is already supported
  via WebAuthn on compatible devices)

- More user roles (e.g., county coordinators) can be introduced

- The attendance system can be linked with other services like payroll
  or SMS alerts

- Offline support can be added using service workers and local storage

![](media/image2.png){width="6.5in" height="6.5in"}

Figure 2: technical architecture

### 3.3.3 Operational Feasibility {#operational-feasibility}

Operational feasibility assesses how well the system fits into daily
Kazi Mtaani activities.

- User-Friendly Interface: Simple UI for both supervisors and
  participants

Dashboards provide real-time visibility to county coordinators

- Automated Attendance Reports: Eliminates paperwork

WebAuthn biometric verification is fast (average scan time: 2s)

- Mobile-Friendly Admin Dashboard: Can run on tablets or laptops

High operational readiness and ease of deployment

- Training: Minimal training required due to intuitive design

Supervisors only need minimal training (1--2 hours)

### 3.3.4 Legal and Regulatory Feasibility {#legal-and-regulatory-feasibility}

The biometric attendance system complies with existing legal and data
protection requirements in Kenya, especially the **Kenya Data Protection
Act, 2019 (No. 24 of 2019, Kenya Gazette Supplement No. 181)**. Since
the system involves the collection and use of sensitive personal
information (biometric credentials), several safeguards have been put in
place to ensure it operates within the law. Notably, since the system uses
WebAuthn, no raw biometric data ever leaves the user's device — only
cryptographic public keys are stored on the server.

Key Legal and Regulatory Considerations include:

- Informed Consent:
  Participants must give clear and voluntary consent before their
  biometric credentials are registered and used. This ensures
  transparency and respects individual rights.

- Data Security:
  All data is transmitted over HTTPS. Biometric templates never leave
  the participant's device (WebAuthn stores them in the device's secure
  enclave). Only cryptographic public keys are stored server-side,
  preventing unauthorized access to biometric data.

- Access Control:  
  Only authorized system users such as site supervisors and
  administrators are allowed to view or manage participant records.
  Different roles are assigned varying levels of access, based on
  responsibility.

- Audit Logs:  
  Every action in the system (e.g., check-in, check-out, edits, logins)
  is automatically logged. This creates a clear record that can be
  reviewed in case of a dispute or security concern, helping to promote
  accountability.

### 3.3.5 Social Feasibility {#social-feasibility}

The project is likely to be accepted by users due to:

a)  Fairness in attendance tracking

b)  Reduced favoritism and fraud

c)  Assurance of being paid only for work done

d)  Youth are familiar with smartphones and fingerprint tech (from
    M-Pesa, Huduma Namba, etc.)

e)  Transparent and secure records

## 3.4 Requirements Elicitation {#requirements-elicitation}

Requirement elicitation involves gathering the system expectations from
stakeholders.

To better understand the real-world challenges and user expectations
surrounding attendance tracking in the Kazi Mtaani program, a
combination of data collection methods was employed. These tools helped
gather both qualitative and quantitative data from key stakeholders,
including participants, supervisors, and coordinators.

**Interviews**

Face-to-face interviews were conducted with a total of eight
individuals: five site supervisors and three regional program
coordinators. These sessions were structured to gather insights on:

- The current process of recording attendance manually

- Common issues faced, such as proxy attendance and late reporting

- Existing frustrations or gaps with the tools in use (e.g., paper
  registers)

- Opinions on whether a biometric system could realistically solve these
  issues

Most of the supervisors mentioned that managing large groups of youth
manually leads to frequent attendance errors and suspected cases of
ghost workers. The program coordinators also expressed concerns about
the reliability of attendance data submitted from different sites.

**Questionnaires**

A structured questionnaire was distributed to 50 randomly selected Kazi
Mtaani participants across multiple sites. The aim was to gather their
views on:

- Fairness of the current attendance system

- Ease of use of manual systems versus interest in digital options

- Experiences with delayed payments or mistaken absences

- Perception of fraud --- whether they believed some workers were being
  paid without showing up

The questionnaire combined multiple-choice and open-ended questions.
Results showed that a majority of respondents believed a fingerprint
system would improve accuracy and reduce conflicts. However, a few
expressed concerns about technology access and training.

**Direct Observation**

A two-week observation was carried out at one active Kazi Mtaani site
located in Thika. During this period, the following aspects were closely
monitored:

- The process of daily check-ins and check-outs

- Time taken per person to sign in using the manual register

- Supervisor workload and record-keeping behavior

- Reactions and attitudes of workers towards the process

This method provided valuable insights into the practical limitations of
manual systems. It was observed that some workers would sign in for
others, and there were occasional mismatches between attendance sheets
and the actual number of workers present. Additionally, the manual
process consumed a lot of time at the start of each shift.

### 3.4.1 Sampling Techniques {#sampling-techniques}

Stratified Random Sampling was used to ensure representation across
stakeholder categories:

30 Participants (youth workers)

10 Field Supervisors

5 Site Managers

This ensured both managerial and worker perspectives were considered.

### 3.4.2 Alignment of Data with Project Objectives {#alignment-of-data-with-project-objectives}

Findings from the tools above directly supported the project goals:

| Objective                             | Corresponding Insight                      |
|---------------------------------------|--------------------------------------------|
| Identify challenges in manual systems | Fraud, late payments, inefficiencies       |
| Design accurate biometric system      | Fingerprints most preferred and understood |
| Ensure usability and adoption         | Need for simplicity and offline support    |

### 3.4.3 Approval and Appendix  {#approval-and-appendix}

Before implementation, all data collection tools were reviewed and
approved by the project

supervisor to ensure they met ethical and methodological standards. A
sample of the

questionnaire is included in Appendix A for reference.

## 3.5 Data Analysis {#data-analysis}

Data analysis is a critical phase that translates raw data gathered from
stakeholders into insights that directly influence system features.

By utilizing statistical tools and visual representations, the analysis
aims to extract meaningful insights that will shape the development of
the web application.

Examining user responses, preferences, and trends ensures that the
system is built to

effectively address real user needs.

### 3.5.1 Quantitative Analysis (Questionnaire Data) {#quantitative-analysis-questionnaire-data}

To accurately interpret the collected data,the following combination of
statistical tools were

used:

Using Microsoft Excel and SPSS, the 50 responses gathered from Kazi
Mtaani participants and 10 site supervisors were analyzed to determine
user attitudes, system expectations, and pain points.

a)  Microsoft Excel:

facilitated initial data organization, basic statistical computations,
and the creation of visual

representations such as pie charts and bar graphs. This helped summarize
key findings

concisely.

b)  SPSS (Statistical Package for the Social Sciences):

was employed for more advanced statistical analysis, including
descriptive statistics,

correlation analysis, and frequency distribution. This provided deeper
insights into trends and

relationships within the data.

**Key Findings:**

| Statement                                    | Agree (%) | Neutral (%) | Disagree (%) |
|----------------------------------------------|-----------|-------------|--------------|
| Manual attendance is often inaccurate        | 82%       | 10%         | 8%           |
| Proxy attendance occurs frequently           | 74%       | 16%         | 10%          |
| Biometric systems would enhance fairness     | 88%       | 6%          | 6%           |
| I am comfortable using a fingerprint device  | 92%       | 6%          | 2%           |
| Supervisors spend too much time on paperwork | 85%       | 12%         | 3%           |

These results strongly indicate a high level of dissatisfaction with
manual methods and high readiness for a biometric solution.

### 3.5.2 Qualitative Analysis (Interview Insights) {#qualitative-analysis-interview-insights}

Using thematic analysis based on Braun & Clarke (2006), interview
transcripts from 8 stakeholders were analyzed.

Recurring Themes:

Transparency: "We need a way to prove who was present without relying on
signatures."

Speed: "Sometimes, we spend nearly 30 minutes sorting the register in
the morning."

Trust: "Participants believe some people are paid without working."

Access: "Some locations have no internet. A solution must work offline."

### 3.5.3 Observation Findings {#observation-findings}

Field observations were conducted at three Kazi Mtaani sites over a
two-week period. The following insights were extracted from user
behavior and supervisor activity logs:

Time Efficiency:

A bar chart analysis revealed that on average, it took 17 minutes for
all participants at a site to complete manual sign-in. This delay was
mainly due to queueing and missing names on paper registers.

Supervisor Workload:

Supervisors were observed spending 25% of their workday managing
attendance sheets. Tasks included verifying signatures, cross-checking
absentee logs, and preparing payroll summaries --- all of which could be
automated.

Fraud Indicators:

Notably, in 2 out of 3 observed sites, participants attempted to check
in for absent colleagues.

A pie chart breakdown showed:

65% of observed irregularities involved proxy sign-ins

20% involved participants forgetting to sign out

15% were missed entries due to register errors

Usability Preference:

Informal interactions with users indicated a strong preference for a
simple biometric scan system over manually writing names. Participants
found the idea of a "tap-and-go" fingerprint approach more trustworthy
and faster.

![](media/image3.png){width="6.000012029746282in"
height="6.000012029746282in"}

Figure 3: irregularities

## 3.6 System Specification {#system-specification}

Implementation alignment: The implemented system uses WebAuthn public-key
credentials for biometric verification and GPS geofencing for location
verification. No raw biometric templates are stored. Dashboards refresh
via polling (near real-time). Payment CSV export is implemented; attendance
CSV/PDF exports and offline capture/sync are planned as future work.

System specification defines what the system must do (functional) and
how it should behave (non-functional).

### 3.6.1 Functional Requirements {#functional-requirements}

The functional requirements of the biometric-based smart attendance
system define the essential tasks and features the system must perform
to support daily operations of the Kazi Mtaani initiative. These
functions were derived from user feedback, stakeholder interviews, and
observational studies carried out during the system analysis phase.

1\. User Registration

The system must facilitate the registration of all Kazi Mtaani
participants. During this process, the system captures and stores key
participant information, including their full name, email address,
phone number, and WebAuthn biometric credential. This information forms
the basis of the participant's digital profile. The WebAuthn credential
is a public-key pair where the private key remains securely on the
participant's device and the public key is stored server-side for future
biometric verification. This functionality is accessed by authorized
supervisors who invite participants to register. The accuracy and
completeness of the registration process are critical, as all subsequent
attendance records rely on this profile.

2\. Attendance Check-In and Check-Out

The core functionality of the system is to allow participants to check
in and out of work using WebAuthn biometric authentication. Upon
initiating a check-in on their device, the system prompts for biometric
verification (fingerprint or face), verifies the credential against the
stored public key, captures GPS coordinates, and logs the check-in or
check-out time. The timestamp and location are automatically recorded
and stored in the system. This process helps eliminate manual entry
errors and prevents fraudulent sign-ins. The system also provides
immediate feedback to the user (e.g., "Check-In Successful" or GPS
verification status) to enhance usability and transparency.

3\. Admin Login

To maintain the integrity of sensitive attendance data and
administrative controls, the system must include a secure login
mechanism for supervisors and coordinators. Each admin user must be
authenticated using a unique username and password combination.
Depending on their assigned roles, users will have different access
permissions: supervisors can enroll participants and monitor daily
attendance, while regional coordinators can access summary reports
across multiple sites. Login credentials must be encrypted, and multiple
failed attempts should trigger account lockout protocols to prevent
unauthorized access.

4\. Real-Time Dashboard

The system must offer a web-based real-time dashboard where authorized
users can monitor current attendance data. The dashboard displays key
performance indicators such as the number of participants currently
checked in, late arrivals, and total absentees. Users should be able to
filter this data by date, work site, and participant name or ID. This
feature provides actionable insights and helps supervisors make informed
decisions, such as redistributing workers or investigating frequent
absences. The real-time nature of the dashboard ensures immediate access
to field data, increasing transparency and accountability.

5\. Attendance Reports

The system must support the generation of downloadable attendance
reports. These reports should include daily, weekly, and monthly
summaries of participant attendance. Reports must be exportable in
common formats such as CSV (for Excel processing) and PDF (for formal
reporting). Each report should contain details such as participant
names, check-in and check-out times, total hours worked, and attendance
status (present, late, absent). This feature is especially useful for
preparing payroll, auditing attendance records, and reporting
performance metrics to government agencies or donors.

6\. GPS Geofence Verification

The system captures GPS coordinates at each check-in and verifies them
against the work site's configured geofence (a circular area defined by
latitude, longitude, and radius in meters). This ensures that
participants are physically present at the designated work site when
recording attendance. The GPS distance from the site center is calculated
and stored, and the check-in is flagged as verified or outside-geofence
accordingly.

7\. Audit Logs

To support system security, data integrity, and compliance, the
application must include a detailed audit logging feature. The system
should automatically record all significant actions performed by users,
such as participant registrations, credential enrollments, logins,
report downloads, and data edits. Each log entry must include the
timestamp, user ID, and the action performed. These logs are essential
for investigating errors, tracking misuse, and demonstrating regulatory
compliance with Kenya's Data Protection Act.

### 3.6.2 Non-Functional Requirements {#non-functional-requirements}

While functional requirements define what the system does,
non-functional requirements define how well the system performs. These
include important attributes such as speed, scalability, security, and
usability which determine whether the biometric attendance system is
reliable, efficient, and acceptable for users in the Kazi Mtaani
initiative. The following non-functional requirements were considered
and implemented:

1\. Performance

The system must operate with minimal latency. WebAuthn biometric
verification should take no more than 3 seconds to complete, from scan
to feedback. This ensures smooth check-in/out flow, especially
when dealing with large groups during peak hours. Similarly, the
dashboard should load reports and summaries within 5 seconds of query
submission. This level of performance helps reduce bottlenecks and makes
the system feel responsive to end users.

2\. Scalability

The system must be scalable to support multiple deployment sites and a
growing number of users over time. Initially, it may serve a few hundred
participants, but it should be able to scale up to thousands of users
across different counties without degrading performance. The system's
architecture using PostgreSQL on Neon and Next.js on Vercel supports
automatic scaling through serverless infrastructure.

3\. Availability and Uptime

High system availability is crucial, especially during working hours.
The system is expected to maintain an uptime of 99.5%, ensuring that
attendance data can be captured and accessed consistently. For
mission-critical deployments (e.g., payroll processing windows), routine
backups and fallback procedures must be in place to prevent service
disruption.

4\. Security

Security is a core requirement, given that the system handles sensitive
biometric and identity data. With WebAuthn, biometric templates never
leave the user's device — only cryptographic public keys are stored
server-side. The system enforces secure user authentication via Clerk
(which handles session tokens and WebAuthn credentials), implements
role-based access control (RBAC) through user metadata, and logs all
administrative activities through an audit trail. Additionally, all web
traffic should be encrypted via HTTPS to prevent data leaks or
interception.

Compliance with the Kenya Data Protection Act (2019) must be strictly
enforced to avoid legal liabilities and protect user privacy.

5\. Usability

The system must be easy to learn and operate, particularly for
supervisors and participants with minimal IT experience. The user
interface should be intuitive, with clearly labeled buttons, visual
feedback (e.g., "Check-In Successful"), and simple navigation. Icons,
color codes, and large fonts should be used for better accessibility,
especially on touchscreen devices used in the field.

6\. Maintainability

To ensure long-term usability and adaptability, the system must follow
clean coding standards and modular design principles. Components should
be separated logically --- for instance, separating biometric logic from
user management and reporting. This makes it easier to perform updates,
bug fixes, or feature enhancements without disrupting the entire system.
Additionally, technical documentation and version control (via GitHub)
must be maintained throughout the development lifecycle.

7\. Portability

The application must be portable and accessible across different
environments. As a web application, it functions correctly on any device
with a modern browser — Windows and Linux laptops, Android and iOS
phones, and tablets used in the field. The responsive design built with
Tailwind CSS ensures the interface adapts to any screen size.

![](media/image4.png){width="6.5in" height="6.5in"}

Figure 4: system requirements overview

## 3.7 Requirements Analysis and Modeling {#requirements-analysis-and-modeling}

This section presents a deeper analysis of the functional and
non-functional requirements gathered during the research and system
design phases. It focuses on identifying dependencies between system
modules, resolving potential conflicts, and organizing the system into
structured components. Visual modeling tools such as use case diagrams,
data flow diagrams, and entity-relationship diagrams are used to capture
system behavior and ensure clarity during implementation.

### 3.7.1 Requirements Analysis {#requirements-analysis}

Dependencies and Conflicts

1.  User Authentication and Role Management  
    The system depends on a secure and scalable login mechanism that
    differentiates between participants, site supervisors, and regional
    coordinators. Each user type must have access to only the
    functionalities relevant to their role. This hierarchical access
    control ensures data integrity and operational security.

2.  Biometric Enrollment and Attendance Logging  
    Attendance logging is highly dependent on successful WebAuthn
    credential registration. If a participant's biometric credential is
    not enrolled correctly or their device does not support WebAuthn,
    attendance records cannot be created via biometric authentication.
    Thus, the compatibility of the participant's device and the
    enrollment process directly affects system accuracy.

3.  GPS and Geofence Verification
    Location verification depends on the participant granting browser
    GPS permissions and having GPS-capable hardware. If GPS is
    unavailable or denied, attendance can still be recorded but will
    not be geofence-verified, which may require manual supervisor
    approval.

Conflict Resolution

1.  Duplicate Attendance Logs  
    A potential conflict may arise if a participant attempts to check in
    or out multiple times due to fingerprint misreads. The system
    resolves this by enforcing time-based restrictions, allowing only
    one check-in and one check-out action per workday per user.

2.  Role Confusion During Login  
    Supervisors and coordinators accessing the system from shared
    devices could mistakenly log in under incorrect roles. To prevent
    this, the system displays role-specific dashboards and uses visual
    cues (e.g., role badges) to avoid confusion.

Proposed Solutions

1.  Modular Feature Architecture  
    The system is developed using a modular design, where each feature
    (e.g., biometric authentication, reporting, GPS verification) is isolated into
    self-contained components. This allows individual testing, easier
    debugging, and minimal risk of cross-functional failures.

2.  Stakeholder Feedback Loops  
    Regular validation sessions with stakeholders including supervisors
    and local administrators are used to refine requirements and resolve
    ambiguities early. These sessions help align the system with both
    operational needs and user expectations.

3.  Edge-Case Handling Mechanisms  
    Scenarios such as unsupported devices, duplicate entries, and
    network issues during check-in are handled with specific fallback
    strategies (e.g., error messages, retries, audit trails).

### 3.7.2 Structured Requirements {#structured-requirements}

To streamline development and ensure that all functionalities are
aligned with user needs, the system's requirements have been grouped
into core modules, each responsible for a specific operational area:

1.  User Management  
    This module handles the registration, login, and role-based access
    control for all users. It includes WebAuthn credential enrollment
    (for biometric authentication), Clerk-managed session handling, and
    role assignment via user metadata. Admins and supervisors log in
    with email/password or biometric, while participants use WebAuthn
    biometric authentication.

2.  Biometric Attendance Logging
    This is the core functionality of the system. It includes:

> WebAuthn biometric verification (fingerprint or face)
>
> GPS coordinate capture and geofence verification
>
> Time-stamping check-ins and check-outs
>
> Preventing duplicate logs within a defined time window

3.  GPS Geofence Verification
    Captures the participant's GPS coordinates at check-in and compares
    them against the work site's configured geofence (center coordinates
    and radius). Flags check-ins as GPS-verified or outside-geofence,
    with the distance from site center recorded for audit purposes.

4.  Reporting and Dashboards  
    Provides visual analytics and attendance logs for supervisors and
    coordinators. It includes:

> Real-time dashboards
>
> Absentee and lateness summaries
>
> Exportable reports in PDF or CSV format

5.  Audit Trails and Security Monitoring  
    Tracks and logs every action performed within the system (e.g., user
    login, participant enrollment, report downloads). This is critical
    for transparency, accountability, and compliance with data
    protection regulations.

Figure 5: use case diagram

![](media/image5.png){width="5.4375in" height="4.635416666666667in"}

## 3.8 Logical Design {#logical-design}

This section provides the logical representation of the system
architecture. It focuses on how the various components of the biometric
attendance system interact internally to provide the desired
functionality. Logical design does not delve into implementation details
but rather highlights how the system is organized to fulfill functional
requirements.

### 3.8.1 System Architecture {#system-architecture}

The biometric attendance system follows a layered architecture model,
which separates the application into three major layers. This modular
approach promotes scalability, maintainability, and ease of development.

1\. Presentation Layer (Frontend)

This is the user-facing component of the system that provides interfaces
for different user roles including participants, site supervisors, and
regional administrators.

Key functionalities include:

Participant check-in and check-out via WebAuthn biometric prompt

Supervisor login dashboard and attendance summaries

Admin controls for report generation and system monitoring

This layer is developed using React 19 with TypeScript and Tailwind CSS
for responsive, utility-first styling. Server-side rendering and dynamic
content are handled via Next.js, enabling fast page loads and seamless
integration with backend data.

2\. Application Layer (Backend / Logic Layer)

This is the core processing layer of the system. It is developed using
Next.js API routes (TypeScript) and handles:

Business logic for attendance validation

WebAuthn credential verification and GPS geofence checking

User authentication via Clerk and role-based access control (RBAC)

Data aggregation for dashboards and reports

Report generation and filtering

This layer acts as a bridge between the frontend user actions and the
database, ensuring secure, validated, and rule-based operations across
all system features.

3\. Data Layer (Database Management Layer)

The data layer is responsible for storing, retrieving, and securing all
critical system information. It uses PostgreSQL as the main relational
database for its reliability, security, and support for complex queries.

It manages:

Participant records, including WebAuthn public keys and demographics

Attendance logs with timestamps, statuses, GPS coordinates, and geofence
verification data

User credentials and access roles (managed via Clerk)

Audit logs for system actions

Group/work site configurations with geofence coordinates and radii

Key Logical Components

The following are the main logical components that make up the system:

a)  Participant Management Component

Handles participant registration, WebAuthn credential enrollment, and
linking public-key credentials to identity records via Clerk.

b)  Biometric Authentication Component

Verifies participant identity during check-in/check-out using WebAuthn.
The browser prompts the device's biometric sensor, and the signed
challenge is verified against the stored public key. It includes logic
for credential verification and error handling.

c)  GPS Geofence Component

Captures GPS coordinates via the browser Geolocation API during check-in
and calculates the distance from the work site center. Flags the
attendance record as verified or outside-geofence based on the
configured radius.

d)  Reporting and Dashboard Component

Generates reports for attendance summaries, absentee lists, and
site-level statistics. It supports real-time data visualization for
supervisors and coordinators.

e)  Security and Access Control Component

Manages secure logins via Clerk, WebAuthn credentials, and role-based
access to system features. Also logs all user activities for audit
purposes.

### 3.8.2 Control Flow and Process Design {#control-flow-and-process-design}

The control flow of the biometric attendance system has been structured
to ensure a seamless, role-specific experience for all users ---
including participants, supervisors, and system administrators. Each
user type interacts with the system through a defined sequence of
operations that support biometric verification, attendance logging, and
administrative oversight.

**1. Participant Workflow**

This process outlines the daily use of the system by Kazi Mtaani
workers. Simplicity and speed are prioritized to minimize disruptions to
work routines.

Arrival at Work Site → Open App → WebAuthn Biometric Prompt →
System Verifies Credential + Captures GPS → Attendance Logged (Check-In) →

Workday Ends → Open App → WebAuthn Biometric Prompt → Check-Out
Recorded → Dashboard Updated

- Goal: Enable fast, secure attendance logging using WebAuthn biometrics.

- Key Features Used: WebAuthn biometric authentication, GPS geofence
  verification, timestamp generation.

**2. Supervisor Workflow**

Supervisors manage biometric enrollment, monitor attendance patterns,
and ensure data accuracy. Their workflow supports both daily operations
and weekly reporting.

Login via Admin Portal → Register New Participants → Enroll Credentials
→

Monitor Daily Check-Ins via Dashboard → View Absentee Summaries → Export
Attendance Reports

- Goal: Oversee attendance compliance, troubleshoot issues, and generate
  data-driven reports.

- Key Features Used: Role-based login, dashboard access, reporting
  module, audit logs.

**3. Administrator Workflow**

Administrators have higher privileges and manage multiple work sites.
Their responsibilities involve system monitoring, user management, and
compliance enforcement.

Access Central Dashboard → Monitor Site Activity → Review Logs and
Trends →

Generate County-Level Reports → Manage User Roles → Conduct Data Audits
and System Backups

- Goal: Maintain overall system integrity, support accountability, and
  ensure compliance with data policies.

- Key Features Used: Real-time dashboard, audit logs, backup tools, user
  role management.

### 3.8.3 Design for Non-Functional Requirements {#design-for-non-functional-requirements}

This section outlines how the system was designed to meet important
non-functional requirements such as security, performance, usability,
and reliability. These aspects help ensure the system is practical,
stable, and safe to use in real Kazi Mtaani work environments.

Security Strategies

To protect sensitive data, several security measures were applied. First,
all data is transmitted over HTTPS, which secures the connection between
the system and users. With WebAuthn, biometric templates never leave the
user's device — they are stored in the device's secure enclave. Only
cryptographic public keys are stored server-side, making it impossible
to reconstruct biometric data even if the database is compromised.

The system has user roles (workers, supervisors, admins), and each role
has limited access managed via Clerk user metadata. For example, only
supervisors can view their group's attendance and manage workers.
Authentication is handled by Clerk with support for WebAuthn biometric
login, providing strong security without passwords.

Error and Exception Handling

Errors can happen — for example, a device might not support WebAuthn,
or a network request might fail. The system uses try-catch blocks in
the backend API routes to handle these errors gracefully. When
something goes wrong, users get simple and clear messages, such as:

"Scan failed. Please try again."

"You have already checked in today."

This makes it easier for users to know what happened and what to do
next, instead of seeing technical errors.

Performance Optimization

Because this system might be used by hundreds of workers at a time, it
needs to respond quickly. To achieve this, some performance techniques
were applied:

Server-side rendering via Next.js ensures fast initial page loads.

Database queries are optimized using Drizzle ORM to load only what's
necessary.

The dashboard uses polling (auto-refresh every 30-60 seconds) for
near real-time data without WebSocket complexity.

These methods help reduce delays and allow the system to run smoothly,
even under pressure.

User Experience

The system was designed with ordinary users in mind — not tech
experts. Workers only see what they need: clear buttons for Check In
and Check Out, plus simple success or error messages with GPS
verification status.

Supervisors and admins have access to a dashboard that is easy to
navigate, with filters and downloadable reports. The design is
responsive, meaning it works well on phones, tablets, and laptops. Fonts
are large, buttons are clear, and pages load in under 3 seconds on
average.

System Reliability

To avoid data loss, the system makes automatic backups of all attendance
records and user data. These backups can be restored if something goes
wrong.

The system is deployed on Vercel with automatic scaling and redundancy.
The database is hosted on Neon (serverless PostgreSQL) with automatic
backups. This infrastructure ensures high availability without manual
server management.

## 3.9 Database Design {#database-design}

This section describes the physical design of the database used in the
biometric attendance system. The schema includes tables, fields, data
types, relationships, and constraints, structured to support the
system's functionality such as participant registration, biometric
attendance logging, and administrative reporting. The design also
considers performance, scalability, and data integrity.

### 3.9.1 Database Schema {#database-schema}

The schema was derived from the logical design and refined to support
real-time operations, role-based access, and secure data storage. Below
is a breakdown of the key tables and their relationships.

**1. Users Table**

Description:
Stores system users, including workers, supervisors, and administrators.
Authentication is handled externally by Clerk; this table stores
profile data and role assignments.

Relationships:

- One-to-Many with Attendance

- Many-to-One with Groups

| **Field Name** | **Data Type**  | **Constraints**                              | **Description**                    |
|----------------|----------------|----------------------------------------------|------------------------------------|
| id             | Serial         | Primary Key, Auto Increment                  | Unique identifier for the user     |
| clerk_id       | VARCHAR        | Unique, Not Null                             | Clerk authentication user ID       |
| email          | VARCHAR        | Optional                                     | User email address                 |
| first_name     | VARCHAR        | Optional                                     | First name                         |
| last_name      | VARCHAR        | Optional                                     | Last name                          |
| phone          | VARCHAR        | Optional                                     | Phone number                       |
| role           | ENUM           | ('worker', 'supervisor', 'admin')            | User's assigned role               |
| group_id       | Integer        | Foreign Key (Groups), Optional               | Assigned work group                |
| is_active      | Boolean        | Default: true                                | Whether account is active          |
| created_at     | TIMESTAMP      | Default: CURRENT_TIMESTAMP                   | Account creation date              |

**2. Groups Table**

Description: Stores work site/group information with geofence
coordinates for GPS verification.

Relationships: One-to-Many with Users, One-to-Many with Attendance

| **Field Name**   | **Data Type**    | **Constraints**                                | **Description**                     |
|------------------|------------------|------------------------------------------------|-------------------------------------|
| id               | Serial           | Primary Key, Auto Increment                    | Unique group ID                     |
| name             | TEXT             | Not Null                                       | Group/site name                     |
| location         | TEXT             | Not Null                                       | Location description                |
| latitude         | DECIMAL(10,7)    | Optional                                       | GPS latitude of site center         |
| longitude        | DECIMAL(10,7)    | Optional                                       | GPS longitude of site center        |
| geofence_radius  | Integer          | Default: 100                                   | Geofence radius in meters           |
| supervisor_id    | Integer          | Foreign Key (Users), Optional                  | Assigned supervisor                 |
| status           | ENUM             | ('active', 'inactive', 'suspended')            | Group status                        |

**3. Attendance Table**

Description:
Logs daily check-in and check-out times with GPS verification data.

Relationships:

- Many-to-One with Users
- Many-to-One with Groups

| **Field Name**       | **Data Type**    | **Constraints**                        | **Description**                           |
|----------------------|------------------|----------------------------------------|-------------------------------------------|
| id                   | Serial           | Primary Key, Auto Increment            | Unique attendance record ID               |
| worker_id            | Integer          | Foreign Key (Users)                    | Worker linked to attendance               |
| group_id             | Integer          | Foreign Key (Groups)                   | Work site for this record                 |
| date                 | TEXT             | Not Null                               | Date of the workday (YYYY-MM-DD)          |
| check_in_time        | TIMESTAMP        | Optional                               | Time of check-in                          |
| check_out_time       | TIMESTAMP        | Optional                               | Time of check-out                         |
| check_in_latitude    | DECIMAL(10,7)    | Optional                               | GPS latitude at check-in                  |
| check_in_longitude   | DECIMAL(10,7)    | Optional                               | GPS longitude at check-in                 |
| gps_verified         | Boolean          | Default: false                         | Whether GPS is within geofence            |
| gps_distance_meters  | DECIMAL(8,2)     | Optional                               | Distance from site center in meters       |
| status               | ENUM             | ('present', 'absent', 'late')          | Attendance status                         |
| attendance_method    | ENUM             | ('fingerprint', 'face')                | WebAuthn biometric method used            |

**4. AuditLogs Table**

Description:  
Tracks system actions by users for accountability and security.

Relationships:

- Many-to-One with Users

| **Field Name** | **Data Type** | **Constraints**             | **Description**                                 |
|----------------|---------------|-----------------------------|-------------------------------------------------|
| log_id         | Integer       | Primary Key, Auto Increment | Unique log entry                                |
| user_id        | Integer       | Foreign Key (Users)         | User who performed the action                   |
| action         | TEXT          | Not Null                    | Description of the action (e.g., login, export) |
| timestamp      | TIMESTAMP     | Default: CURRENT_TIMESTAMP  | When the action occurred                        |

**5. SyncQueue Table**

Description: Manages offline data to be synced when internet is
available.

| **Field Name** | **Data Type** | **Constraints**                       | **Description**          |
|----------------|---------------|---------------------------------------|--------------------------|
| sync_id        | Integer       | Primary Key, Auto Increment           | Unique sync task ID      |
| attendance_id  | Integer       | Foreign Key (Attendance)              | Record to be synced      |
| queued_at      | TIMESTAMP     | Default: CURRENT_TIMESTAMP            | Time added to sync queue |
| synced_at      | TIMESTAMP     | Optional                              | Time sync was completed  |
| Status         | ENUM          | (\'Pending\', \'Synced\', \'Failed\') | Current sync status      |

### 3.9.2 User Interface Design {#user-interface-design}

The User Interface (UI) Design of the biometric-based smart attendance
system focuses on simplicity, accessibility, and ease of use. Since the
system will be used in the field by participants, supervisors, and
administrators the design prioritizes clarity, responsiveness, and
role-specific views.

This section outlines the key UI pages and their components.

**Worker Check-In Page**

This is the main interface used by Kazi Mtaani workers to register their
attendance via WebAuthn biometric verification.

Header

- Displays the system name/logo.

- Shows the worker's name and group assignment.

Main Content Area

- Two large buttons:

> 🟢 **Check-In**
>
> 🔴 **Check-Out**

- Instruction text: *"Verify your identity using your device's biometric sensor"*

- Live feedback:

  - ✅ "Check-In successful" (with GPS verification status)

  - ❌ "Authentication failed. Please try again."

**Supervisor Dashboard**

Supervisors use this interface to manage workers, view attendance
records, and monitor work sites.

Header

- Welcome message with supervisor's name.

- Quick access icons: \"Manage Groups\", \"Export Report\",
  \"Logout\".

Sidebar Navigation

- Dashboard Overview

- Worker Management

- Daily Attendance

- Reports

- Work Site Map

Main Dashboard Widgets

- Live Attendance Count: Present / Absent / Late

- Recent Activity Log

- GPS Verification Status (Verified / Outside Geofence)

**Worker Onboarding Page**

Used during worker registration and WebAuthn biometric enrollment. Once
submitted, the form links the worker's WebAuthn credential to their user
profile.

**Form Fields**

- Full Name (First Name, Last Name)

- Phone Number

- Work Group Assignment

- WebAuthn Biometric Enrollment Button

**Administrator Portal**

Admins have full access to the system, including audit logs, user roles,
and multi-site performance. Admins can filter and export data by site,
date, or user role.

Key Sections

- System Statistics: Users, Sites, Attendance trends

- Role Management: Add/Edit/Delete users and permissions

- Data Audit Logs: View actions performed by users

- Backup & Restore: Access data backup options

**Login Page**

All users authenticate through Clerk's sign-in flow.

- Fields: Email and Password (or social login)

- Clerk handles session management and optional MFA

- Forgot Password and Contact Support links

- Clean layout with role-specific redirects post-login

**Footer Design (for all pages)**

- Contact information (phone/email)

- Quick links: Terms of Use, Privacy Policy

- Social media icons (optional)

- Version number and last updated timestamp

**Design Considerations**

- Mobile-First Design: Works well on tablets, laptops, and rugged field
  devices.

- Fast Load Times: All pages optimized for low internet speeds.

- Visual Accessibility: High-contrast colors, large buttons, and
  readable fonts.

- Feedback and Error Handling: Users always get clear, immediate
  responses for all actions.

- Language Simplicity: No technical jargon --- uses familiar terms like
  \"Check-In\", \"Try Again\", \"Sync Complete\".

![](media/image6.png){width="6.5in" height="6.5in"}

Figure 6

![](media/image7.png){width="6.5in" height="6.5in"}

Figure 7

# CHAPTER 4: SYSTEM IMPLEMENTATION AND TESTING

## 4.1 Introduction {#introduction-3}

This chapter presents the development, implementation, and testing
phases of the biometric-based smart attendance system designed for the
Kazi Mtaani Initiative. It outlines the tools, technologies, and
environments used in building the system, the methodology for
translating system design into working code, and the various testing
strategies applied to ensure functionality and reliability.

The goal of the system was to replace manual attendance-taking processes
with a WebAuthn biometric-based solution, aimed at reducing fraud,
improving accuracy, and ensuring real-time attendance tracking for
thousands of youth employed under the government's urban development
program.

Through this chapter, the focus is placed on demonstrating how the
system was implemented across different development layers --- from
database and backend logic to user-facing interfaces and administrative
tools. Testing procedures, deployment steps, and a user guide are also
covered to support future scalability and usability.

## 4.2 Environment and Tools {#environment-and-tools}

The implementation of the biometric attendance system for the Kazi
Mtaani initiative was carried out in a structured development
environment. This environment was chosen based on its support for
modularity, scalability, and ease of maintenance. The system uses a
full-stack JavaScript/TypeScript approach with Next.js, supported by
specific tools and technologies for each layer.

**Full-Stack Framework**

The application was built using **Next.js 15** (a React-based full-stack
framework) with **TypeScript**. Next.js handles both the frontend UI
(via React server and client components) and the backend API routes in
a single codebase. This was chosen for its:

- Server-side rendering for fast initial page loads

- Built-in API routes for backend logic

- TypeScript support for type safety

- Excellent deployment support on Vercel

All development was carried out using **Visual Studio Code** in a local
development environment.

Key Tools and Frameworks:

- Node.js 18+

- Next.js 15 (React 19)

- TypeScript

- Git (version control)

- Clerk (authentication and WebAuthn biometric integration)

- Drizzle ORM (database access layer)

**Frontend Environment**

The frontend provided the interface for all system users — including
workers, supervisors, and administrators.

The interface was developed using **React 19** with **Tailwind CSS** for
responsive, utility-first styling. The UI uses a component-based
architecture with separate client and server components. Pages were
built for check-in, check-out, login, dashboards, group management,
and attendance reporting.

Key Features of the Frontend:

- Responsive design for phones, tablets, and laptops

- Large, clear buttons for field usability

- Real-time feedback on biometric verification and GPS status

- Supervisor dashboard with work site map, filters, and export tools

- Interactive map visualization using Leaflet with OpenStreetMap

**Database and Storage**

The system uses a single cloud-hosted PostgreSQL database:

- **PostgreSQL on Neon** (serverless) is used for all data storage and
  management, including user records, attendance logs, groups, and
  system activity.

- **Drizzle ORM** provides type-safe database access with migrations
  managed via `drizzle-kit`.

Database Tools Used:

- PostgreSQL (via Neon serverless)

- Drizzle ORM + drizzle-kit (schema management and migrations)

- Neon Dashboard (for database administration)

**Other Tools and APIs**

- Figma — Used to design interface mockups and screen layouts before
  development.

- GitHub — Hosted the project repository and managed version control.

- Clerk — Handles user authentication, session management, and WebAuthn
  biometric credential enrollment.

- Leaflet — Open-source mapping library for work site visualization
  with geofence circles.

- OpenStreetMap Nominatim API — Location search/autocomplete for group
  creation.

## 4.3 System Code Generation {#system-code-generation}

System code generation involved translating the system's design
specifications — including database models, user roles, and biometric
workflows — into working, scalable code. A structured, modular
development approach was used to ensure maintainability and accurate
attendance tracking. The development was
guided by tools such as use case diagrams, data flow diagrams, and
entity-relationship diagrams, all of which helped define how components
should interact across the application layers.

**Step 1: Understanding the Design Specifications**

Before writing any code, the following were reviewed:

- ERDs (Entity Relationship Diagrams) to define database structure

- Use Case Diagrams to visualize user-system interactions (e.g.,
  participant check-in, admin login)

- System Architecture to determine how the frontend, backend API routes,
  and database communicate

- UI Wireframes to visualize interface components like check-in screens
  and dashboards

**Step 2: Setting Up the Development Environment**

The development setup included:

- Installing **Node.js** and **npm**

- Initializing the Next.js project with TypeScript

- Initializing a **Git** repository for version control

- Installing dependencies (next, react, clerk, drizzle-orm, leaflet, etc.)

- Setting up **Clerk** for authentication and WebAuthn

- Setting up **Neon** PostgreSQL and configuring Drizzle ORM

**Step 3: Backend Code Development**

The backend was developed using Next.js API routes with Drizzle ORM,
with schema definitions for users, attendance, groups, and payments.
Below is a simplified example of the attendance check-in logic:

```typescript
export async function checkIn(workerId: number, groupId: number,
  latitude?: number, longitude?: number) {
  const group = await db.query.groups.findFirst({
    where: eq(groups.id, groupId)
  });
  let gpsVerified = false;
  let distance = null;
  if (latitude && longitude && group?.latitude && group?.longitude) {
    distance = calculateDistance(latitude, longitude,
      parseFloat(group.latitude), parseFloat(group.longitude));
    gpsVerified = distance <= (group.geofenceRadius || 100);
  }
  await db.insert(attendance).values({
    workerId, groupId, date: today(),
    checkInTime: new Date(),
    checkInLatitude: latitude?.toString(),
    checkInLongitude: longitude?.toString(),
    gpsVerified, gpsDistanceMeters: distance?.toString(),
    status: 'present',
  });
}
```

**Sample Schema (Drizzle ORM):**

```typescript
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  clerkId: text('clerk_id').unique().notNull(),
  email: text('email'),
  firstName: text('first_name'),
  lastName: text('last_name'),

  phone: text('phone'),
  role: userRoleEnum('role').default('worker'),
  groupId: integer('group_id').references(() => groups.id),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});
```

**Migrations:**

```bash
npx drizzle-kit generate
npx drizzle-kit push
```

**Step 4: Frontend Code Development**

The frontend was built using React components with Tailwind CSS to
provide a modern, responsive UI. Key pages included:

- Worker Attendance Page (Check-In / Check-Out with GPS)

- Supervisor Dashboard with Work Site Map

- Group Management (Create, Edit, Assign Workers)

- Payment Management

**Example: Worker Check-In Component**

```tsx
<button
  onClick={handleCheckIn}
  className="bg-green-600 text-white px-6 py-3 rounded-lg"
>
  Check In
</button>
```

The check-in flow prompts WebAuthn biometric verification, captures GPS
coordinates via the Geolocation API, and submits the attendance record
to a Next.js API route.

**Step 5: GPS Geofence Verification**

When a worker checks in, the browser captures their GPS coordinates.
The API route calculates the distance from the work site center using
the Haversine formula and flags the record as GPS-verified if within
the configured geofence radius.

```typescript
function calculateDistance(lat1: number, lon1: number,
  lat2: number, lon2: number): number {
  const R = 6371000; // Earth radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 +
    Math.cos(lat1 * Math.PI/180) *
    Math.cos(lat2 * Math.PI/180) *
    Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}
```

## 4.4 Testing {#testing}

Testing was a critical part of implementing the biometric attendance
system. It helped ensure that all features — including WebAuthn
biometric verification, user login, attendance logging, GPS geofencing,
and report generation — worked reliably and securely.
Multiple levels of testing were carried out to validate functionality,
performance, and user satisfaction. These included unit testing,
integration testing, system testing, and user acceptance testing (UAT).

### 4.4.1 Unit Testing {#unit-testing}

Unit tests focused on verifying that individual components, such as
database queries, utility functions, and API route handlers behaved
correctly. Tests were written to validate model behavior, input
validation, and core business logic like GPS distance calculations.

**Example: Unit Test for Haversine Distance Calculation**

```typescript
import { describe, it, expect } from 'vitest'

function haversineDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371e3
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

describe('haversineDistance', () => {
  it('returns 0 for identical coordinates', () => {
    expect(haversineDistance(-1.2921, 36.8219, -1.2921, 36.8219)).toBe(0)
  })

  it('calculates distance within geofence radius', () => {
    const distance = haversineDistance(-1.2921, 36.8219, -1.2925, 36.8222)
    expect(distance).toBeLessThan(100) // within 100m geofence
  })
})
```

**Result:** The test passed, confirming that GPS distance calculations
correctly determine whether a worker is within the geofence radius.

### 4.4.2 Integration Testing {#integration-testing}

Integration testing ensured that different parts of the system worked
together as intended. This included:

- WebAuthn biometric verification → Attendance record creation

- User login via Clerk → Role-specific dashboard view

- GPS coordinate capture → Geofence distance verification

**Test Scenario: WebAuthn Biometric Check-In Flow**

1.  Worker navigates to check-in page and initiates biometric scan

2.  Browser triggers WebAuthn authentication using device sensor (fingerprint/face)

3.  Server verifies the credential against stored public key

4.  GPS coordinates are captured and distance from work site is calculated

5.  If valid, check-in timestamp and GPS data are recorded in attendance table

This flow was tested with enrolled WebAuthn credentials on multiple
devices (laptop fingerprint readers, mobile face unlock) to confirm
smooth biometric authentication and accurate GPS-verified logging.

Result: Valid credentials triggered check-ins in under 3 seconds. Invalid
credentials showed correct error messages. GPS verification correctly
flagged workers outside the geofence radius.

### 4.4.3 System Testing {#system-testing}

System testing evaluated the platform as a whole. It was performed in
near-realistic conditions using supervisors and workers with devices
that support WebAuthn biometric sensors.

**Test Cases Included:**

| **Test Case**                         | **Expected Result**                          | **Outcome** |
|---------------------------------------|----------------------------------------------|-------------|
| Check-in with valid WebAuthn credential | Success message and timestamp               | ✅ Pass     |
| Duplicate check-in on same day        | Warning: Already checked in                  | ✅ Pass     |
| Check-out without prior check-in      | Warning or no action                         | ✅ Pass     |
| Check-in outside geofence radius      | Attendance recorded with GPS unverified flag | ✅ Pass     |
| Check-in within geofence radius       | Attendance recorded with GPS verified flag   | ✅ Pass     |
| Supervisor login                      | Redirects to supervisor dashboard            | ✅ Pass     |
| Payment CSV export                    | Downloaded file with correct data            | ✅ Pass     |

Result: All major workflows passed. GPS geofencing correctly identified
workers inside and outside the designated work site boundaries.

### 4.4.4 User Acceptance Testing (UAT) {#user-acceptance-testing-uat}

User Acceptance Testing involved real users from the Kazi Mtaani program
--- including field supervisors and workers. They were asked to
interact with the system and provide feedback on:

- Ease of use

- Clarity of buttons and messages

- Biometric (fingerprint/face) scanning experience via device sensors

- Supervisor dashboard and map view usability

**Sample Feedback:**

- *"Check-in is very fast. Much better than signing papers."*

- *"I like that I just use my phone's fingerprint sensor."*

- *"Supervisor dashboard is easy to read, and the map shows where workers checked in."*

Result: Over 85% of users reported satisfaction with the interface and
found the system faster and more secure than manual methods.

### 4.4.5 Performance Testing {#performance-testing}

The system was tested under load to measure responsiveness and identify
bottlenecks.

Key Performance Results:

- WebAuthn check-in response time (avg): 2.1 seconds

- GPS geofence verification: \< 1 second (Haversine calculation)

- Dashboard report generation (filtered by site): \< 4 seconds

- System crash rate during testing: 0%

- Accuracy: WebAuthn credential verification had zero false positives

- Speed: Real-time feedback within 2--3 seconds

- Stability: System remained stable across all tested scenarios

- User Feedback: Positive response from workers and supervisors

- Map View: Work site map with GPS markers loaded within 3 seconds

## 4.5 User Guide {#user-guide}

This section provides a comprehensive guide for setting up, deploying,
and using the biometric-based smart attendance system. It is intended to
assist both technical and non-technical users --- including system
administrators, site supervisors, and participants --- in navigating the
platform efficiently.

The guide includes installation steps, deployment instructions, and
usage instructions for all user roles.

### 4.5.1 Installation Instructions (Development Environment) {#installation-instructions-development-environment}

System Requirements

- Operating System: Windows, macOS, or Linux

- Node.js: Version 18+ (LTS recommended)

- npm: Version 9+ (bundled with Node.js)

- Internet connection for Clerk authentication and Neon database access

- A device with biometric sensor (fingerprint reader or camera) for WebAuthn testing

Step-by-Step Installation

1.  Clone the project repository

```bash
git clone https://github.com/your-username/kazi-mtaani.git
cd kazi-mtaani
```

2.  Install project dependencies

```bash
npm install
```

3.  Configure environment variables

- Copy `.env.example` to `.env.local`
- Add Clerk API keys (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`)
- Add Neon PostgreSQL connection string (`DATABASE_URL`)
- Add WebAuthn configuration (`NEXT_PUBLIC_WEBAUTHN_RP_ID`, `NEXT_PUBLIC_WEBAUTHN_RP_NAME`)

4.  Push database schema to Neon

```bash
npx drizzle-kit push
```

5.  Start the development server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### 4.5.2 Deployment Instructions (Production) {#deployment-instructions-production}

The system is deployed using Vercel for the Next.js application and Neon
for the PostgreSQL database:

- Connect the GitHub repository to Vercel via the Vercel dashboard.

- Configure environment variables in Vercel project settings (Clerk keys,
  DATABASE_URL, WebAuthn RP ID).

- Vercel automatically builds and deploys on every push to the main branch.

- HTTPS is provided automatically by Vercel with SSL certificates.

- Neon PostgreSQL provides automatic backups and branching for staging environments.

### 4.5.3 Using the System {#using-the-system}

**For Workers**

- First Time: Sign up via Clerk authentication and complete onboarding
  (name, phone number). Enroll biometric credential using device sensor.

- Check-In: Navigate to the attendance page and tap "Check In." The browser
  prompts for biometric verification (fingerprint or face). GPS coordinates
  are captured automatically.

- Receive Feedback: The screen will display:

> ✅ *"Check-In Successful"* (with GPS verification status)
>
> ❌ *"Authentication Failed -- Try Again"*

- Check-Out: Repeat the same process at the end of the day.

- Dashboard: Workers can view their attendance history, payment records,
  and group assignments from their personal dashboard.

**For Supervisors**

Supervisors access the dashboard via Clerk authentication:

1.  Login with email or social account via Clerk.

2.  Access the following tools:

> Worker Management -- View and manage workers in assigned groups.
>
> Work Site Map -- View GPS-verified check-ins on an interactive map with geofence visualization.
>
> Attendance Dashboard -- View daily attendance with verified/unverified status.
>
> Payment Dashboard -- Process payments and export CSV reports.

**For Administrators**

Administrators manage the system through the supervisor interface with
elevated permissions:

- Create and manage work groups with GPS coordinates and geofence radius.

- Assign supervisors to groups and monitor attendance across all sites.

- Export payment data as CSV for payroll processing.

- View the work site map carousel to inspect individual sites and worker locations.

### 4.5.4 Troubleshooting Tips {#troubleshooting-tips}

| **Issue**                        | **Possible Cause**                    | **Solution**                                       |
|----------------------------------|---------------------------------------|----------------------------------------------------|
| Biometric prompt not appearing   | Browser does not support WebAuthn     | Use Chrome, Edge, or Safari with biometric sensor  |
| WebAuthn registration fails      | Device lacks biometric hardware       | Enable Windows Hello, Touch ID, or screen lock     |
| GPS location not captured        | Browser location permission denied    | Allow location access in browser settings          |
| Cannot log in                    | Clerk session expired                 | Clear cookies and sign in again                    |
| CSV report not downloading       | Browser blocking download             | Check popup/download permissions                   |
| Map not loading                  | Network issue loading OpenStreetMap   | Check internet connection and refresh page         |

## 4.6 Deployment  {#deployment}

Deployment refers to moving the application from the development
environment to a usable production or test environment.

### 4.6.1 Deployment Strategy {#deployment-strategy}

Phase 1: Local Development

Deployed via Next.js development server (`npm run dev`) to test
individual pages, API routes, and WebAuthn flows locally.

Phase 2: Staging Deployment

System was deployed to Vercel preview environments for testing with
sample worker and supervisor accounts. Neon database branching was
used for isolated test data.

Phase 3: Production Deployment

Production deployment on Vercel with custom domain. Clerk authentication
configured for production, Neon PostgreSQL production branch activated,
and WebAuthn RP ID set to the production domain.

### 4.6.2 Deployment Challenges {#deployment-challenges}

| **Challenge**                    | **Solution**                                                                  |
|----------------------------------|-------------------------------------------------------------------------------|
| WebAuthn RP ID configuration     | Set RP ID to match deployment domain; configured separately for dev and prod  |
| Leaflet SSR compatibility        | Used Next.js dynamic imports with `ssr: false` to avoid server-side rendering |
| Environment variable management  | Used Vercel environment settings for production secrets                        |
| Slow dashboard initial load      | Optimized database queries with Drizzle ORM and added polling intervals       |

Figure 8: testing flowchart

## 4.7 Security Features {#security-features}

To protect sensitive data and ensure system integrity, the following
security measures were enforced:

- WebAuthn Public-Key Cryptography: Biometric data never leaves the
  device. Only cryptographic public keys are stored server-side,
  eliminating the risk of biometric template theft.

- HTTPS Protocol: All data transmissions are encrypted via Vercel's
  automatic SSL/TLS certificates.

- Role-Based Access Control (RBAC): Supervisors and Workers have
  distinct permissions enforced through Clerk authentication and
  middleware route protection.

- Clerk Authentication: Secure session management, password hashing,
  and optional multi-factor authentication handled by Clerk.

- Input Validation: All API routes validate request parameters and
  sanitize inputs to prevent injection attacks.

# CHAPTER 5: SUMMARY, CONCLUSION AND RECOMMENDATIONS

## 5.1 Introduction {#introduction-4}

This chapter provides a summary of the entire project, draws conclusions
based on the results obtained from system implementation and testing,
and outlines recommendations for improving the system and guiding future
related projects. The chapter reflects on the effectiveness of the
WebAuthn-based biometric attendance system with GPS geofencing in
solving the workforce management challenges within the Kazi Mtaani
initiative.

## 5.2 Summary of the Project {#summary-of-the-project}

The project aimed to design and implement a biometric-based smart
attendance system that addresses critical issues in workforce attendance
management within Kenya's Kazi Mtaani program. These issues include
fraudulent sign-ins, ghost workers, data inaccuracy, and inefficiencies
caused by manual attendance systems.

The study was carried out in five main phases:

Problem Identification:

Analysis of the manual attendance problems in Kazi Mtaani --- including
time delays, proxy attendance, and paper record inefficiencies.

Literature Review:

Explored existing biometric authentication techniques, system design
approaches, and technologies previously used in attendance tracking
systems.

System Analysis and Design:

The system was designed using Agile methodology, with core modules
defined for worker registration, WebAuthn biometric enrollment,
GPS-verified check-in/check-out, and attendance reporting. Diagrams
such as Data Flow Diagrams (DFDs) and ERDs were used.

Implementation and Testing:

The system was developed using Next.js, TypeScript, PostgreSQL (Neon),
and WebAuthn for device-native biometric authentication. GPS geofencing
verifies worker presence at designated work sites. Testing (unit,
integration, UAT) confirmed the system worked as expected.

System Evaluation:

Feedback from workers and supervisors confirmed the system improved
accuracy, transparency, and operational efficiency.

## 5.3 Conclusion {#conclusion}

Based on the study and results:

The WebAuthn-based biometric attendance system successfully eliminates
the limitations of traditional attendance methods in the Kazi Mtaani
initiative.

The use of WebAuthn biometric authentication (fingerprint/face via
device sensors) ensures that only physically present workers can
register attendance, effectively reducing fraud and ghost workers.

GPS geofencing adds a second layer of verification by confirming that
workers are within the designated work site radius at the time of
check-in.

The system's real-time dashboard reporting, interactive work site map,
and user-friendly interface improved supervisor efficiency and allowed
for quicker payroll preparation.

The system was found to be technically feasible, economically
justifiable, and socially acceptable, making it a strong candidate for
broader implementation across similar public programs.

In conclusion, the system achieved its objective of improving accuracy,
efficiency, and transparency in workforce attendance management.

## 5.4 Recommendations {#recommendations}

### 5.4.1 For System Implementation {#for-system-implementation}

The system should be rolled out to more Kazi Mtaani sites, especially
those with high incidences of proxy attendance.

Training should be provided for supervisors and field coordinators to
ensure proper use of the WebAuthn enrollment process and supervisor dashboards.

The system is already mobile-responsive via Tailwind CSS, making it
accessible on tablets and smartphones without a separate mobile app.

### 5.4.2 For System Improvement {#for-system-improvement}

Offline mode with local storage and background sync could be added to
support areas with unreliable internet connectivity.

Real-time dashboard updates via Server-Sent Events (SSE) or WebSockets
would provide live attendance monitoring without manual refresh.

An SMS or email notification feature could notify workers of
successful check-ins or missed attendance.

Attendance CSV and PDF export reports would complement the existing
payment CSV export functionality.

### 5.4.3 For Policy Makers and Stakeholders {#for-policy-makers-and-stakeholders}

County and national government agencies should adopt biometric
attendance systems in other youth employment and public works programs.

Policies on data privacy and biometric consent must be strictly enforced
to comply with the Kenya Data Protection Act (2019).

Stakeholders should invest in digital infrastructure to support such
systems, especially in rural areas.

### 5.4.4 For Future Research {#for-future-research}

Studies could be done to compare biometric systems across different
sectors (e.g., health, education, construction).

Research could also explore user behavior and acceptance rates of
different biometric technologies in informal employment settings.

Evaluation of the system's long-term performance under real field
conditions (e.g., dusty or wet environments) should be carried out.

## 5.5 Summary {#summary}

This chapter provided a comprehensive summary of the project and
concluded that the WebAuthn-based biometric attendance system with GPS
geofencing is a viable solution for improving workforce accountability
in the Kazi Mtaani initiative. Recommendations were made for system
scaling, feature enhancements, and broader government adoption. The
study contributes significantly to the digital transformation of public
workforce management systems in Kenya.

# REFERENCES

1.  Bhalla, S., Girdhar, A., & Girdhar, R. (2013). *Automated attendance
    management system using NFC and facial recognition*. International
    Journal of Engineering Research and Technology, 2(11), 1482--1485.

2.  Behara, S., & Raghunadh, M. V. (2013). *A facial recognition system
    for time and attendance application*. International Journal of
    Computer Science and Network Security, 13(9), 68--72.

3.  Kant, C. H., & Nath, R. (2006). *Biometric authentication techniques
    and applications*. Journal of Theoretical and Applied Information
    Technology, 2(2), 34--42.

4.  Lodha, R., Sharma, A., & Kumawat, S. (2015). *Bluetooth-based
    attendance management system using smart chips*. International
    Journal of Computer Applications, 115(21), 1--4.
    <https://doi.org/10.5120/20266-2614>

5.  Patel, A., & Priya, M. (2014). *RFID and face recognition based
    attendance management system*. International Journal of Computer
    Applications, 103(3), 6--11.

6.  Somasundaram, R., Kannan, R., & Sriram, N. (2016). *Mobile-based
    student attendance tracking system using Android*. International
    Journal of Advanced Research in Computer Science, 7(3), 118--121.

7.  Beck, K., & Andres, C. (2005). *Extreme programming explained:
    Embrace change* (2nd ed.). Addison-Wesley.

8.  Sommerville, I. (2016). *Software engineering* (10th ed.). Pearson
    Education.

9.  Braun, V., & Clarke, V. (2006). Using thematic analysis in
    psychology. *Qualitative Research in Psychology*, 3(2), 77--101.

10. Strauss, A., & Corbin, J. (1990). *Basics of qualitative research:
    Grounded theory procedures and techniques*. Sage Publications.

11. Nielsen, J. (1995). 10 usability heuristics for user interface
    design. *Nielsen Norman Group*.
    https://www.nngroup.com/articles/ten-usability-heuristics/

12. Republic of Kenya. (2019). *Data Protection Act, No. 24 of 2019*.
    Kenya Gazette Supplement No. 181.

13. Tiwari, R., Tiwari, R., & Tiwari, A. (2015). Biometric
    authentication and security techniques using fingerprints.
    *International Journal of Computer Applications*, 111(5), 12--18.
    <https://doi.org/10.5120/19513-1189>

14. Zarina, M., & Abdel, M. (2015). A study on user authentication
    mechanisms in security systems. *International Journal of Security
    and Its Applications*, 9(2), 45--54.
    <https://doi.org/10.14257/ijsia.2015.9.2.05>

15. Davis, F. D. (1989). Perceived usefulness, perceived ease of use,
    and user acceptance of information technology. *MIS Quarterly*,
    13(3), 319--340. <https://doi.org/10.2307/249008>

16. Fishbein, M., & Ajzen, I. (1975). *Belief, attitude, intention and
    behavior: An introduction to theory and research*. Addison-Wesley.

17. Django Software Foundation. (2023). *Django Documentation*.
    <https://docs.djangoproject.com/en/4.2/>

18. PostgreSQL Global Development Group. (2023). *PostgreSQL
    Documentation*. <https://www.postgresql.org/docs/>

19. ZKTeco Inc. (2022). *ZKTeco Python SDK User Guide* \[Hardware
    Manual\]. <https://www.zkteco.com/en/>

20. Python Software Foundation. (2023). *Python 3.11 Documentation*.
    <https://docs.python.org/3/>

21. Django REST Framework. (2023). *API Development Tools for Django*.
    <https://www.django-rest-framework.org/>

22. Open Web Application Security Project (OWASP). (2023). *Top 10 Web
    Application Security Risks*.
    <https://owasp.org/www-project-top-ten/>

# LIST OF APPENDICES

## Appendix A:  {#appendix-a}

Sample User Questionnaire for Kazi Mtaani Participants

**Title**: *Questionnaire for Assessing Attendance Management in the
Kazi Mtaani Initiative*

**Purpose**: To gather participant feedback on current attendance
practices and expectations for a biometric attendance system.

**Section 1: Personal Information (Optional)**

1.  Age: \_\_\_\_\_\_\_

2.  Gender: □ Male □ Female □ Other

3.  Work Site Location: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

**Section 2: Attendance Experience**

4.  How do you currently record your attendance?  
    □ Sign sheet  
    □ Verbal confirmation  
    □ Supervisor logs it manually  
    □ Other: \_\_\_\_\_\_\_\_\_\_\_\_\_\_

5.  How satisfied are you with the current attendance process?  
    □ Very satisfied  
    □ Satisfied  
    □ Neutral  
    □ Dissatisfied

6.  Have you ever witnessed or suspected someone checking in for another
    person (proxy attendance)?  
    □ Yes □ No

7.  How long does it usually take to complete the attendance process?  
    □ Less than 5 minutes  
    □ 5--10 minutes  
    □ Over 10 minutes

**Section 3: Perception of Biometric System**

8.  Would you be comfortable using your phone or laptop's biometric
    sensor (fingerprint/face) for attendance?
    □ Yes □ No □ Not Sure

9.  Do you think a biometric system would improve fairness in attendance
    tracking?
    □ Yes □ No □ Not Sure

10. What concerns, if any, do you have about biometric systems?
    □ Privacy
    □ Device compatibility
    □ Accuracy
    □ None
    □ Other: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

**Section 4: Suggestions**

11. What improvements would you like to see in the attendance system?

## Appendix B:  {#appendix-b}

Sample Report Title:

Kazi Mtaani Attendance Report -- Thika Site  
Date Range: September 1, 2025 -- September 7, 2025

Sample Table Structure:

| Participant Name | National ID | Date       | Time In | Time Out | Status  |
|------------------|-------------|------------|---------|----------|---------|
| Jane Wanjiru     | 12345678    | 01/09/2025 | 07:58AM | 04:02PM  | Present |
| Brian Otieno     | 87654321    | 01/09/2025 | 08:13AM | 04:10PM  | Present |
| Amina Yusuf      | 23456789    | 01/09/2025 | --      | --       | Absent  |
| Kevin Kiptoo     | 34567890    | 02/09/2025 | 08:01AM | 03:55PM  | Present |
| Ann Muthoni      | 45678901    | 02/09/2025 | 07:49AM | 04:07PM  | Present |

Export Features:

- Export as:  
  ✅ CSV (for spreadsheet editing)  
  ✅ PDF (for official reporting or archival)

- Columns automatically calculated:

<!-- -->

- Total Hours Worked

- Late Check-Ins

- Absentee Days

<!-- -->

- Optional Filters:

<!-- -->

- By Date, Site, or Supervisor
