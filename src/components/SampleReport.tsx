import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Camera, Check, Download, FileText, X, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BrandMark } from './UI';
import { bookingLink } from '../data';
import { reportExample } from '../content/inspection';
import { SCORE_DISCLAIMER } from '../content/catalog';
import { ScoreBoard, SeverityBadge, SeverityLegend } from './InspectionScore';

const ReportContext = createContext<() => void>(() => {});
export const useSampleReport = () => useContext(ReportContext);

export function ReportDocument({
  full = false,
  context = 'CivicQC property inspection',
}: {
  full?: boolean;
  context?: string;
}) {
  return (
    <div className={`report-document ${full ? 'report-document-full' : ''}`}>
      <div className="report-doc-header">
        <div className="report-doc-brand">
          <BrandMark />
          <span>
            Civic<span>QC</span>
            <small>CONSULTANTS</small>
          </span>
        </div>
        <span className="report-doc-code">
          QC / SAMPLE 001
          <br />
          <b>ILLUSTRATIVE SAMPLE</b>
        </span>
      </div>
      <div className="report-doc-title">
        <span className="mono">CLARITY IN EVERY DETAIL.</span>
        <h3>
          Property inspection
          <br />
          report.
        </h3>
        <span className="report-doc-rule" />
      </div>
      <div className="report-property">
        <div>
          <small>PROPERTY</small>
          <strong>{reportExample.property}</strong>
          <span>Fictional property · not a client record</span>
        </div>
        <div>
          <small>INSPECTION DATE</small>
          <strong>{reportExample.date}</strong>
          <span>Illustrative assessment only</span>
        </div>
      </div>
      <ScoreBoard compact />
      <div className="report-finding">
        <div className="report-finding-photo">
          <img
            src="/images/moisture-detail.webp"
            alt={`AI-generated illustration of a moisture meter at a damp window reveal, shown in the ${context} sample report; not client evidence.`}
            width="1448"
            height="1086"
            loading="lazy"
          />
          <span>
            <Camera size={11} />
            ILLUSTRATIVE PHOTO
          </span>
        </div>
        <div className="report-finding-text">
          <SeverityBadge severity="major" />
          <h4>Moisture near window reveal</h4>
          <span className="report-room">Living room · Example D03</span>
          <p>Visible moisture indicators around the window-wall junction.</p>
          <strong>Recommended action</strong>
          <p>Investigate the source and arrange appropriate rectification before repainting.</p>
        </div>
      </div>
      {full && (
        <div className="report-full-findings">
          <h4>All 14 illustrative observations</h4>
          <div
            className="report-table-wrap"
            role="region"
            tabIndex={0}
            aria-label="All illustrative report findings"
          >
            <table>
              <thead>
                <tr>
                  <th scope="col">Location / concern</th>
                  <th scope="col">Severity</th>
                  <th scope="col">Recommended next step</th>
                </tr>
              </thead>
              <tbody>
                {reportExample.findings.map((finding) => (
                  <tr key={finding.id}>
                    <td>
                      <strong>
                        {finding.id} · {finding.location}
                      </strong>
                      <br />
                      {finding.title}
                    </td>
                    <td>
                      <SeverityBadge severity={finding.severity} />
                    </td>
                    <td>{finding.recommendation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h4>Consistent severity definitions</h4>
          <SeverityLegend />
          <h4>Overall assessment</h4>
          <p>
            The example score is 87 / 100 (Good), with 108 / 120 inspection points assessed and 14
            fictional observations. Twelve points were not assessed in this example. The score is
            not a pass percentage and is not calculated here from the defect count.
          </p>
          <p>
            A Critical finding still requires prompt professional attention even when the overall
            rating is Good. Prioritise appropriate assessment and rectification, then verify the
            completed work.
          </p>
          <div className="report-scope-note">
            <strong>Scope &amp; limitations</strong>
            <p>{SCORE_DISCLAIMER}</p>
            <p>
              This report, date, property and findings are illustrative, not an actual inspection.
              The demonstration photograph is AI-generated and is not proof of a defect at any
              client property. Laboratory records and specialist assessments follow their own agreed
              scope.
            </p>
          </div>
        </div>
      )}
      <div className="report-doc-footer">
        <span>CIVICQC CONSULTANTS · NAGPUR</span>
        <span>ILLUSTRATIVE · {full ? 'DIGITAL PREVIEW' : 'SAMPLE EXTRACT'}</span>
      </div>
    </div>
  );
}

export function SampleReportProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const openReport = () => {
    trigger.current = document.activeElement as HTMLElement;
    setOpen(true);
  };
  const close = () => setOpen(false);
  useEffect(() => {
    if (!open) return;
    const node = dialog.current;
    node?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      node?.close();
      document.body.style.overflow = overflow;
      trigger.current?.focus();
    };
  }, [open]);
  return (
    <ReportContext.Provider value={openReport}>
      {children}
      {open && (
        <dialog
          ref={dialog}
          className="sample-dialog"
          aria-labelledby="sample-title"
          onCancel={close}
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <div className="sample-dialog-inner">
            <header className="sample-dialog-header">
              <div>
                <FileText size={20} />
                <div>
                  <h2 id="sample-title">A clearer picture of your property.</h2>
                  <p>Explore an illustrative CivicQC report.</p>
                </div>
              </div>
              <button
                type="button"
                className="icon-button"
                onClick={close}
                aria-label="Close sample report"
              >
                <X size={22} />
              </button>
            </header>
            <div
              className="sample-dialog-body"
              tabIndex={0}
              role="region"
              aria-label="Sample inspection report content"
            >
              <div className="sample-note">
                <Check size={16} />
                Demonstration only. Findings, dates and photographs are illustrative.
              </div>
              <ReportDocument full />
            </div>
            <footer className="sample-dialog-footer">
              <a className="btn btn-dark" href="/CivicQC-Sample-Inspection-Report.pdf" download>
                <Download size={17} />
                Download sample PDF
              </a>
              <Link to={bookingLink('technical-report')} className="text-link" onClick={close}>
                Discuss your inspection
                <ArrowUpRight size={17} />
              </Link>
            </footer>
          </div>
        </dialog>
      )}
    </ReportContext.Provider>
  );
}
