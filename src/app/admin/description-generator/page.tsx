import { DescriptionGeneratorForm } from '@/components/admin/description-generator-form';

export const metadata = {
  title: 'AI Description Generator - Gleam Gallery Admin',
  description: 'Generate compelling jewelry descriptions using AI.',
};

export default function AiDescriptionGeneratorPage() {
  return (
    <div className="space-y-6">
      <DescriptionGeneratorForm />
    </div>
  );
}
