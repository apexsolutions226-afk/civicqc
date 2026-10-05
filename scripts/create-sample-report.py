"""Rebuild the illustrative sample PDF from the same JSON used by the website.
Requires reportlab and pillow. No client data or genuine inspection result is used.
"""
from pathlib import Path
import json
from collections import Counter
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image, KeepTogether
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from PIL import Image as PILImage
from io import BytesIO

ROOT=Path(__file__).resolve().parent.parent
DATA=json.loads((ROOT/'src/content/report-example.json').read_text())
COUNTS=Counter(f['severity'] for f in DATA['findings'])
assert len(DATA['findings']) == DATA['defects'] == 14
assert all(COUNTS[level['id']] == level['count'] for level in DATA['severities'])
for name in ['Inter-Regular','Inter-SemiBold','Space-Regular','Space-SemiBold']:
    pdfmetrics.registerFont(TTFont(name,str(ROOT/f'design-assets/{name}.ttf')))
INK=colors.HexColor('#102630'); TEAL=colors.HexColor('#236a5a'); AQUA=colors.HexColor('#88dfce'); PAPER=colors.HexColor('#f1f6ef'); LINE=colors.HexColor('#d4dfd3'); MUTED=colors.HexColor('#526a58')
styles={
 'label':ParagraphStyle('label',fontName='Inter-SemiBold',fontSize=8,leading=12,textColor=TEAL,spaceAfter=12),
 'h1':ParagraphStyle('h1',fontName='Space-SemiBold',fontSize=34,leading=37,textColor=INK,spaceAfter=17),
 'h2':ParagraphStyle('h2',fontName='Space-SemiBold',fontSize=22,leading=27,textColor=INK,spaceAfter=14),
 'h3':ParagraphStyle('h3',fontName='Space-SemiBold',fontSize=13,leading=17,textColor=INK,spaceAfter=8),
 'body':ParagraphStyle('body',fontName='Inter-Regular',fontSize=9,leading=14,textColor=MUTED,spaceAfter=11),
 'small':ParagraphStyle('small',fontName='Inter-Regular',fontSize=7.5,leading=11.5,textColor=MUTED,spaceAfter=8),
 'score':ParagraphStyle('score',fontName='Space-SemiBold',fontSize=30,leading=36,textColor=AQUA,alignment=TA_CENTER),
 'scorelabel':ParagraphStyle('scorelabel',fontName='Inter-Regular',fontSize=8,leading=12,textColor=colors.white,alignment=TA_CENTER),
 'cell':ParagraphStyle('cell',fontName='Inter-Regular',fontSize=8,leading=12,textColor=MUTED),
}
def p(text,style='body'):
    return Paragraph(str(text).replace('&','&amp;'),styles[style])
severity_colors={'critical':'#963d3b','major':'#875a19','moderate':'#386c84','minor':'#4f7246'}
SCORE_DISCLAIMER='The CivicQC Inspection Score is an indicative assessment based on the inspected components and defined inspection criteria. It is not a structural stability certificate, safety guarantee, or guarantee against concealed defects.'

def chrome(canvas,doc):
    w,h=doc.pagesize
    canvas.saveState()
    canvas.setFillColor(INK);canvas.setFont('Space-SemiBold',15);canvas.drawString(42,h-39,'CivicQC')
    canvas.setFont('Inter-Regular',6.5);canvas.setFillColor(MUTED);canvas.drawString(43,h-51,'C O N S U L T A N T S')
    canvas.setFont('Inter-SemiBold',7);canvas.setFillColor(TEAL);canvas.drawRightString(w-42,h-37,'ILLUSTRATIVE SAMPLE / QC 001')
    canvas.setStrokeColor(LINE);canvas.line(42,h-62,w-42,h-62);canvas.line(42,46,w-42,46)
    canvas.setFont('Inter-Regular',6.7);canvas.setFillColor(MUTED);canvas.drawString(42,33,'NOT A CLIENT RECORD · NOT AN ACTUAL INSPECTION RESULT')
    canvas.drawRightString(w-42,33,f'CIVICQC · {doc.page}')
    canvas.restoreState()

path=ROOT/'public/CivicQC-Sample-Inspection-Report.pdf'
doc=SimpleDocTemplate(str(path),pagesize=(595.28,841.89),leftMargin=42,rightMargin=42,topMargin=85,bottomMargin=65,title='CivicQC Illustrative Property Inspection Report',author='CivicQC Consultants',subject='Fictional inspection example: 87/100, 108/120 points, 14 findings, four severity levels')
story=[p('YOUR INDEPENDENT PROPERTY QUALITY PARTNER','label'),p('Property inspection<br/>report.','h1'),p('An illustrative example of clear reporting, defined severity and actionable recommendations.'),p(DATA['property'],'h3'),p(DATA['date']+' · Fictional scope and findings','small')]
metrics=Table([[p('87 / 100','score'),p('108 / 120','score'),p('14','score')],[p('GOOD · INDICATIVE SCORE','scorelabel'),p('INSPECTION POINTS ASSESSED','scorelabel'),p('ILLUSTRATIVE DEFECTS','scorelabel')]],colWidths=[170,170,171])
metrics.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),INK),('TOPPADDING',(0,0),(-1,0),18),('BOTTOMPADDING',(0,1),(-1,1),19),('VALIGN',(0,0),(-1,-1),'MIDDLE')]))
story += [Spacer(1,12),metrics,Spacer(1,20)]
levels=[]
for level in DATA['severities']:
    st=ParagraphStyle('sev-'+level['id'],parent=styles['h3'],textColor=colors.HexColor(severity_colors[level['id']]),alignment=TA_CENTER)
    levels.append(Paragraph(f"{level['count']}<br/>{level['label'].upper()}",st))
t=Table([levels],colWidths=[127.75]*4);t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),PAPER),('BOX',(0,0),(-1,-1),.5,LINE),('TOPPADDING',(0,0),(-1,-1),13),('BOTTOMPADDING',(0,0),(-1,-1),9)]));story += [t,Spacer(1,20),p('A good score does not override a Critical finding.','h3'),p('The example contains one Critical finding requiring prompt professional attention. The score is not a structural stability or absolute safety certification.'),p('108 / 120 means points assessed, not points passed. Twelve points were not assessed in this example. The score is not the completion percentage and is not calculated here from the defect count.'),p(SCORE_DISCLAIMER,'small'),p('Indicative rating bands','h3')]
ratings=Table([[p(r['range'],'cell'),p(r['label'],'cell')] for r in DATA['ratings']],colWidths=[135,376]);ratings.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),PAPER),('LINEBELOW',(0,0),(-1,-1),.4,LINE),('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),6)]));story += [ratings,PageBreak()]
story += [p('FROM OBSERVATION TO ACTION','label'),p('A finding you can understand.','h2'),p('D03 · Living room · Moisture at the window reveal','h3')]
im=PILImage.open(ROOT/'public/images/moisture-detail.webp').convert('RGB');buf=BytesIO();im.save(buf,format='JPEG',quality=88);buf.seek(0)
story += [Image(buf,width=511,height=285,kind='proportional'),Spacer(1,9),p('AI-GENERATED ILLUSTRATIVE PHOTOGRAPH. NOT CLIENT EVIDENCE.','small'),p('MAJOR — Significant defect requiring corrective action.','label'),p(DATA['findings'][2]['observation']),p('Recommended next step','h3'),p(DATA['findings'][2]['recommendation']),p('How to read this report','h3'),p('Observations state what was accessible and observed within the agreed scope. Recommendations identify sensible next steps; they are not an instruction to carry out unsafe work or a guarantee of the exact root cause. Appropriate specialists should assess safety-related or technically complex concerns.'),p('The sample photograph illustrates the reporting format only. Other rows in this sample are fictional text examples; no genuine client photographs or laboratory results are presented.','small'),PageBreak()]
for start in (0,5,10):
    group=DATA['findings'][start:start+5]
    story += [p('SYSTEMATIC. DOCUMENTED. INDICATIVE.','label'),p(f'Observations {start+1:02d}–{start+len(group):02d}','h2')]
    for finding in group:
        color=severity_colors[finding['severity']]
        label_style=ParagraphStyle('findinglabel-'+finding['id'],parent=styles['label'],textColor=colors.HexColor(color),spaceAfter=7)
        items=[Paragraph(f"{finding['id']} / {finding['location'].upper()} / {finding['severity'].upper()}",label_style),p(finding['title'],'h3'),p(finding['observation'],'small'),p('Recommended next step: '+finding['recommendation'],'small'),Spacer(1,12)]
        story.append(KeepTogether(items))
    story.append(PageBreak())
story += [p('CONSISTENT CRITERIA. CLEAR LIMITATIONS.','label'),p('Severity & scope.','h2')]
for level in DATA['severities']:
    story += [p(level['label'].upper(),'h3'),p(level['definition'])]
story += [Spacer(1,12),p('Inspection Disclaimer','h3'),p('CivicQC inspection services are intended to identify observable and instrument-assisted construction, workmanship, moisture, finishing and functional concerns within the defined inspection scope. An inspection does not guarantee the absence of concealed defects and should not be represented as a structural stability certificate or absolute safety certification unless a separately qualified service is specifically provided. Specialized laboratory testing and engineering assessments may be subject to separate scope and charges.'),p(SCORE_DISCLAIMER),p('After rectification','h3'),p('Keep the original findings and the builder’s rectification information. A separately agreed Re-Inspection can record accessible rectification status and before/after comparisons where applicable. It does not guarantee that all concealed issues have been eliminated.'),p('CivicQC Consultants · Nagpur, Maharashtra','h3'),p('Call / WhatsApp: +91 8275363060<br/>Email: civicqc.consultants@gmail.com'),p('All property details, dates, observations, counts and the score in this document are fictional examples. This sample must not be presented as an actual client inspection or certification.','small')]
doc.build(story,onFirstPage=chrome,onLaterPages=chrome)
print(f'Created {path} ({path.stat().st_size:,} bytes)')
