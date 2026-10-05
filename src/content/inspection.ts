import example from './report-example.json' with { type: 'json' };
export const reportExample = example;
export type Severity = 'critical' | 'major' | 'moderate' | 'minor';
export type Finding = {
  id: string;
  severity: Severity;
  location: string;
  title: string;
  observation: string;
  recommendation: string;
};
export const severityLevels = example.severities;
const testingExamples: Finding[] = [
  {
    id: 'T01',
    severity: 'major',
    location: 'Sample documentation',
    title: 'Incomplete sample traceability',
    observation: 'An example sample record does not clearly identify its source or reference.',
    recommendation: 'Clarify sample identity and documentation before interpreting any results.',
  },
  {
    id: 'T02',
    severity: 'moderate',
    location: 'Test requirements',
    title: 'Test scope needs clarification',
    observation: 'The example brief does not specify all required tests or sample quantities.',
    recommendation:
      'Agree the method, sample requirements, laboratory charges and turnaround before commissioning tests.',
  },
  {
    id: 'T03',
    severity: 'moderate',
    location: 'Visible material condition',
    title: 'Concern needs supporting evidence',
    observation:
      'An example visible material concern requires context; no strength or stability conclusion is implied.',
    recommendation:
      'Obtain appropriate professional advice on whether laboratory or NDT testing is suitable.',
  },
];
export const exampleFindings: Finding[] = [...(example.findings as Finding[]), ...testingExamples];
export const getFinding = (id: string) => exampleFindings.find((finding) => finding.id === id)!;
