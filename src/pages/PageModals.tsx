import type { Person, Relationship } from '@/types/family';
import type { RelativeType, AddRelativeModalProps } from '@/components/AddRelativeModal';
import { PersonFormModal } from '@/components/PersonFormModal';
import { AddRelativeModal } from '@/components/AddRelativeModal';
import { ShareSuccessModal } from '@/components/ShareSuccessModal';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';
import { LoadFileModal } from '@/components/LoadFileModal';

export interface PageModalsProps {
  isPersonModalOpen: boolean;
  closePersonModal: () => void;
  editingPerson: Person | null;
  handleSavePerson: (p: Person) => void;
  isRelativeModalOpen: boolean;
  closeRelativeModal: () => void;
  relativeTargetPerson: Person | null;
  secondParent?: Person | null;
  relativeType: RelativeType;
  treeData: { people: Person[]; relationships: Relationship[] } | null;
  targetSpouses: Person[];
  handleAddRelative: AddRelativeModalProps['onAddRelative'];
  showShareModal: boolean;
  setShowShareModal: (open: boolean) => void;
  shareData: { id: string; token?: string; url: string } | null;
  isDeleteModalOpen: boolean;
  closeDeleteModal: () => void;
  deletingPerson: Person | null;
  deleteDependents: { children: Person[]; spouses: Person[]; parents: Person[] };
  onConfirmDelete: (personId: string) => void;
  isLoadModalOpen: boolean;
  closeLoadModal: () => void;
  onSelectGoogleDrive: () => void;
  onSelectLocalFile: (content: string, fileName: string) => void;
  onLoadExample?: () => void;
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
  isDeleteModalOpen,
  closeDeleteModal,
  deletingPerson,
  deleteDependents,
  onConfirmDelete,
  isLoadModalOpen,
  closeLoadModal,
  onSelectGoogleDrive,
  onSelectLocalFile,
  onLoadExample,
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

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        person={deletingPerson}
        dependents={deleteDependents}
        onConfirmDelete={onConfirmDelete}
        language={language}
      />

      <LoadFileModal
        isOpen={isLoadModalOpen}
        onClose={closeLoadModal}
        onSelectGoogleDrive={onSelectGoogleDrive}
        onSelectLocalFile={onSelectLocalFile}
        onLoadExample={onLoadExample}
        language={language}
      />
    </>
  );
}
