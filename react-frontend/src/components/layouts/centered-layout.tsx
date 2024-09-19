export default function CenteredLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-svh sm:grid sm:place-items-center px-5 relative py-20 sm:py-5">
      {children}
    </main>
  );
}
