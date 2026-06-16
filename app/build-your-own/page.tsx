import BuildYourOwnForm from "@/components/build-your-own-form";

export default function BuildYourOwnPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-10">
      <section className="space-y-5 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-gold">Customize</p>
        <h1 className="text-4xl font-semibold sm:text-5xl">Build your own luxury coffee.</h1>
        <p className="mx-auto max-w-2xl leading-8 text-ink/70">
          Choose every detail and see the price update live. Perfect for custom orders, gifts, or the coffee lover who wants full control.
        </p>
      </section>
      <BuildYourOwnForm />
    </main>
  );
}
