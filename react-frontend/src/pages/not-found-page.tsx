import CenteredLayout from "@/components/layouts/centered-layout";

export default function NotFoundPage() {
  return (
    <CenteredLayout>
      <div className="space-y-8 max-w-[450px]">
        <header>
          <h1 className="font-medium">Not found</h1>
          <p>The page you are looking for does not exist.</p>
        </header>
      </div>
    </CenteredLayout>
  );
}
