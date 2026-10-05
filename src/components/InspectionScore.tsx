import { useId, useState } from 'react';
import { AlertTriangle, ArrowRight, ChevronDown, ClipboardCheck, FileCheck2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { reportExample, severityLevels } from '../content/inspection';
import type { Severity } from '../content/inspection';
import { SCORE_DISCLAIMER } from '../content/catalog';
import { Eyebrow } from './UI';

export function SeverityBadge({ severity }: { severity: string }) {
  const level = severityLevels.find((level) => level.id === severity)!;
  return (
    <span className={`qc-severity qc-${level.id}`}>
      <i aria-hidden="true" />
      {level.label}
    </span>
  );
}
export function SeverityLegend({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`qc-severity-legend ${compact ? 'qc-severity-legend-compact' : ''}`}
      aria-label="CivicQC defect severity levels"
    >
      {severityLevels.map((level) => (
        <div key={level.id}>
          <SeverityBadge severity={level.id} />
          {!compact && <p>{level.definition}</p>}
        </div>
      ))}
    </div>
  );
}
export function ScoreBoard({ compact = false }: { compact?: boolean }) {
  const uid = useId();
  return (
    <div
      className={`qc-score-board ${compact ? 'qc-score-compact' : ''}`}
      role="group"
      aria-labelledby={`${uid}-score`}
    >
      <div className="score-board-top">
        <span>
          <ClipboardCheck size={16} />
          CIVICQC INSPECTION SCORE
        </span>
        <span>ILLUSTRATIVE EXAMPLE</span>
      </div>
      <div className="score-board-main">
        <div className="score-gauge">
          <svg viewBox="0 0 180 180" aria-hidden="true">
            <circle cx="90" cy="90" r="73" fill="none" stroke="#304852" strokeWidth="4" />
            <circle
              cx="90"
              cy="90"
              r="73"
              fill="none"
              stroke="#7ce0d1"
              strokeWidth="4"
              strokeDasharray={`${(2 * Math.PI * 73 * reportExample.score) / 100} ${2 * Math.PI * 73}`}
              transform="rotate(-90 90 90)"
            />
            <circle
              cx="90"
              cy="90"
              r="64"
              fill="none"
              stroke="#304852"
              strokeWidth=".5"
              strokeDasharray="1 8"
            />
          </svg>
          <div>
            <strong id={`${uid}-score`}>
              {reportExample.score}
              <small>/ 100</small>
            </strong>
            <span>{reportExample.rating.toUpperCase()}</span>
          </div>
        </div>
        <div className="score-metrics">
          <span className="score-metric-label">SYSTEMATIC. DOCUMENTED. INDICATIVE.</span>
          <div>
            <strong>
              {reportExample.pointsInspected} <span>/ {reportExample.pointsTotal}</span>
            </strong>
            <span>Inspection Points</span>
            <small>
              Assessed, not “passed” · {reportExample.pointsTotal - reportExample.pointsInspected}{' '}
              not assessed in this example
            </small>
          </div>
          <div>
            <strong>{reportExample.defects}</strong>
            <span>Defects Identified</span>
            <small>Fictional findings for demonstration only</small>
          </div>
        </div>
      </div>
      <div className="score-severity-counts">
        {severityLevels.map((level) => (
          <div key={level.id}>
            <span className={`qc-severity-dot qc-dot-${level.id}`} />
            <strong>{level.count}</strong>
            <span>{level.label}</span>
          </div>
        ))}
      </div>
      <div className="score-critical-note">
        <AlertTriangle size={14} />
        <span>
          A “Good” overall score does not override a Critical finding. Prompt professional attention
          is still required.
        </span>
      </div>
    </div>
  );
}
export default function InspectionScore({ embedded = false }: { embedded?: boolean }) {
  const [filter, setFilter] = useState<Severity | 'all'>('all');
  const [expanded, setExpanded] = useState(false);
  const findings = reportExample.findings.filter(
    (finding) => filter === 'all' || finding.severity === filter,
  );
  const Tag = embedded ? 'div' : 'section';
  return (
    <Tag className={`score-section ${embedded ? 'score-embedded' : 'section'}`}>
      <div className={embedded ? '' : 'container'}>
        <div className="score-intro-grid">
          <div>
            <Eyebrow>BEYOND A LIST OF DEFECTS</Eyebrow>
            <h2>
              A clearer picture.
              <br />
              <span className="muted-heading">Not a blanket guarantee.</span>
            </h2>
            <p>
              The CivicQC Inspection Score brings inspected components and defined criteria into one
              indicative view—alongside the findings that still need your attention.
            </p>
            <p className="score-eligibility">
              Included with PDI, Villa / Row House Inspection and Comprehensive Property Audit.
            </p>
            <Link className="text-link" to="/pricing">
              Compare inspection packages
              <ArrowRight size={16} />
            </Link>
          </div>
          <ScoreBoard />
        </div>
        <div className="score-rating-scale" aria-label="Indicative score rating bands">
          {reportExample.ratings.map((rating) => (
            <div className={rating.label === 'Good' ? 'score-band-current' : ''} key={rating.range}>
              <strong>{rating.range}</strong>
              <span>{rating.label}</span>
            </div>
          ))}
        </div>
        <p className="score-disclaimer">
          <strong>Indicative assessment.</strong> {SCORE_DISCLAIMER} The score is not the percentage
          of inspection points completed and is not calculated here from defect counts.
        </p>
        <button
          type="button"
          className="score-example-toggle"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
        >
          <FileCheck2 size={17} />
          {expanded ? 'Hide' : 'Explore'} the 14 illustrative findings
          <ChevronDown size={16} />
        </button>
        {expanded && (
          <div className="score-findings">
            <div className="score-filters" aria-label="Filter illustrative findings">
              {(['all', ...severityLevels.map((level) => level.id)] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFilter(level as Severity | 'all')}
                  aria-pressed={filter === level}
                >
                  {level === 'all'
                    ? 'All findings'
                    : severityLevels.find((entry) => entry.id === level)!.label}
                </button>
              ))}
            </div>
            <p className="sr-only" aria-live="polite">
              {findings.length} illustrative findings shown
            </p>
            <div className="score-finding-grid">
              {findings.map((finding) => (
                <article key={finding.id}>
                  <span className="finding-code">
                    {finding.id} / {finding.location}
                  </span>
                  <SeverityBadge severity={finding.severity} />
                  <h3>{finding.title}</h3>
                  <p>{finding.observation}</p>
                  <small>{finding.recommendation}</small>
                </article>
              ))}
            </div>
          </div>
        )}
        <SeverityLegend />
      </div>
    </Tag>
  );
}
