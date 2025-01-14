import EditRequestPage from '@/app/section/Request/EditRequest/editRequest';

export default function Request({ params }: { params: { alias: string } }) {
  return <EditRequestPage alias={params.alias} />;
}
