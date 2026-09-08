import { Slide } from '../types';

export const MANDATORY_CHECKLIST_ITEMS: string[] = [
  'TCS Interview Invite Mail Print Out',
  'TCS Application Form',
  'Updated Resume',
  'Pan Card',
  'E-Aadhar Card (Unmasked and without password) – (downloaded today from E- Aadhar card portal) and get a printout of the same.',
  '10th & 12th Marksheet',
  'College Marksheet till 4th semester (If you do not have the original marksheet, kindly bring a copy of your result along with an attestation from your college)'
];

export const MANDATORY_IMPORTANT_NOTES: string[] = [
  'Electronic media devices (Pen drive / Tab / Hard Disk/ Personal laptop) are not permitted inside the facility.',
  'Parents are not allowed inside the interview premises'
];

export const mandatoryDocumentsSlide: Slide = {
  id: 'mandatory-documents-checklist',
  slideNumber: 2,
  sectionId: 'agenda',
  sectionTitle: 'MANDATORY CHECKLIST',
  slideTitle: 'Documents to Carry for the Drive',
  slideSubtitle: 'Physical Document Verification Checklist — All Items Required',
  badge: 'Mandatory',
  isMandatoryChecklist: true,
  content: {
    paragraphs: MANDATORY_CHECKLIST_ITEMS,
    keyNotes: MANDATORY_IMPORTANT_NOTES
  },
  tags: [
    'documents',
    'checklist',
    'mandatory',
    'verification',
    'invite mail',
    'application form',
    'resume',
    'pan card',
    'aadhar',
    'marksheet'
  ]
};
