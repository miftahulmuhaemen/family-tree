import { InitGuideSubSection } from './getting-started/InitGuideSubSection';
import { CanvasControlsSubSection } from './getting-started/CanvasControlsSubSection';
import { NodeRelationshipsSubSection } from './getting-started/NodeRelationshipsSubSection';
import { SidebarToolsSubSection } from './getting-started/SidebarToolsSubSection';

export function GettingStartedSection() {
  return (
    <>
      <InitGuideSubSection />
      <CanvasControlsSubSection />
      <NodeRelationshipsSubSection />
      <SidebarToolsSubSection />
    </>
  );
}

export default GettingStartedSection;
