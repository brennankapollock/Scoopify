import React from 'react';
import { useAuth } from '../../../../contexts/auth';
import { BusinessOnboardingData } from '../../../business-onboarding/types';
import EditableContent from './EditableContent';

interface EditableSectionProps {
  business: BusinessOnboardingData;
  sectionId: string;
  children: React.ReactNode;
}

const EditableSection: React.FC<EditableSectionProps> = ({
  business,
  sectionId,
  children,
}) => {
  const { user } = useAuth();

  return (
    <span className="relative inline-block">
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          // Handle EditableContent components directly
          if (child.type === EditableContent) {
            return React.cloneElement(child, {
              business,
              sectionId,
            });
          }
          // Recursively handle nested children
          if (child.props.children) {
            return React.cloneElement(child, {
              children: React.Children.map(child.props.children, grandChild => {
                if (React.isValidElement(grandChild) && grandChild.type === EditableContent) {
                  return React.cloneElement(grandChild, {
                    business,
                    sectionId,
                  });
                }
                return grandChild;
              })
            });
          }
        }
        return child;
      })}
    </span>
  );
};

export default EditableSection;