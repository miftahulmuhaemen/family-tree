import type { Person, Relationship } from '@/types/family';
import type { RelativeType } from '@/components/AddRelativeModal';
import { PersonFormModal } from '@/components/PersonFormModal';
import { AddRelativeModal } from '@/components/AddRelativeModal';
import { ShareSuccessModal } from '@/components/ShareSuccessModal';

export interface PageModalsProps {
  isPersonModalOpen: boolean;
  closePersonModal: () => void;
  editingPerson: Person | null;
  handleSavePerson: (p: any) => void;
  isRelativeModalOpen: boolean;
  closeRelativeModal: () => void;
  relativeTargetPerson: Person | null;
  secondParent?: Person | null;
  relativeType: RelativeType;
  treeData: { people: Person[]; relationships: Relationship[] } | null;
  targetSpouses: Person[];
  handleAddRelative: (payload: any) => void;
  showShareModal: boolean;
  setShowShareModal: (open: boolean) => void;
  shareData: { id: string; token: string; url: string } | null;
  language: 'id' | 'en';
}

export function PageModals({
  isPersonModalOpen,
  closePersonModal,
  editingPerson,
  handleSavePerson,
  isRelativeModalOpen,
  closeRelativeModal,
  relativeTargetPerson,
  secondParent,
  relativeType,
  treeData,
  targetSpouses,
  handleAddRelative,
  showShareModal,
  setShowShareModal,
  shareData,
  language
}: PageModalsProps) {
  return (
    <>
      <PersonFormModal
        isOpen={isPersonModalOpen}
        onClose={closePersonModal}
        person={editingPerson}
        onSave={handleSavePerson}
        language={language}
      />

      <AddRelativeModal
        isOpen={isRelativeModalOpen}
        onClose={closeRelativeModal}
        targetPerson={relativeTargetPerson}
        secondParent={secondParent}
        relativeType={relativeType}
        allPeople={treeData?.people || []}
        allRelationships={treeData?.relationships || []}
        spousesOfTarget={targetSpouses}
        onAddRelative={handleAddRelative}
        language={language}
      />

      <ShareSuccessModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        shareData={shareData}
        language={language}
      />
    </>
  );
}
