
import { Link } from "react-router-dom";
import { ArrowRight, Heart, Leaf, Sparkles } from "lucide-react";
import { useGetAllProductsQuery } from "../../products/api/productsApi";

export default function Home() {
  const { data: products, isLoading, isError } = useGetAllProductsQuery();

  const featuredProducts = (products ?? []).slice(0, 4);

  return (
    <main className="min-h-screen bg-background text-text">
      {/* Hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 sm:px-8 md:py-20 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 lg:order-1">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted">
            <Sparkles className="h-4 w-4 text-primary" />
            A little better. A lot more delicious.
          </span>

          <h1 className="mt-6 max-w-xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Feel-good treats,
            <span className="block text-primary">
              baked with love.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-muted sm:text-lg">
            Discover delicious baked goods made for life's little moments.
            Thoughtful recipes, tempting flavors, and treats worth sharing.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-semibold text-white shadow-sm transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Shop our treats
              <ArrowRight className="h-5 w-5" />
            </Link>

            <a
              href="#our-story"
              className="inline-flex items-center rounded-full border border-border bg-surface px-7 py-3.5 font-semibold text-text transition hover:border-primary"
            >
              Our story
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted">
            <span className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-primary" />
              Made with care
            </span>
            <span className="flex items-center gap-2">
              <Leaf className="h-4 w-4 text-primary" />
              Thoughtful ingredients
            </span>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="relative mx-auto max-w-xl">
            <div className="absolute -inset-3 rounded-[2rem] bg-primary/10 sm:-inset-5" />

            <img
              src="/images/home-bakery.jpg"
              alt="A selection of freshly baked cookies and wholesome treats"
              className="relative h-72 w-full rounded-[1.5rem] object-cover shadow-lg sm:h-96 lg:h-[480px]"
            />

            <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-border bg-surface/95 p-4 shadow-md backdrop-blur sm:bottom-7 sm:left-7 sm:right-auto sm:max-w-xs">
              <p className="text-sm font-medium text-muted">
                Your next favorite
              </p>
              <p className="mt-1 text-lg font-bold">
                Something delicious awaits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Brand values */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-5 py-8 sm:grid-cols-3 sm:px-8">
          <div className="text-center">
            <Heart className="mx-auto h-6 w-6 text-primary" />
            <h2 className="mt-3 font-semibold">Made with care</h2>
            <p className="mt-1 text-sm text-muted">
              Recipes created with thought and attention.
            </p>
          </div>

          <div className="text-center">
            <Leaf className="mx-auto h-6 w-6 text-primary" />
            <h2 className="mt-3 font-semibold">Thoughtful choices</h2>
            <p className="mt-1 text-sm text-muted">
              Ingredients chosen with intention.
            </p>
          </div>

          <div className="text-center">
            <Sparkles className="mx-auto h-6 w-6 text-primary" />
            <h2 className="mt-3 font-semibold">Flavor comes first</h2>
            <p className="mt-1 text-sm text-muted">
              Delicious treats for everyday enjoyment.
            </p>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-20">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              From our bakery
            </p>
            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
              Treat yourself
            </h2>
            <p className="mt-3 max-w-xl text-muted">
              Explore the baked goods made to bring a little joy to your day.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex w-fit items-center gap-2 font-semibold text-primary transition hover:text-primary-hover"
          >
            View all products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {isLoading ? (
          <p className="py-12 text-center text-muted">
            Fresh treats are on their way...
          </p>
        ) : isError ? (
          <div className="mt-8 rounded-2xl border border-border bg-surface p-8 text-center">
            <p className="font-semibold">
              We couldn't load our treats right now.
            </p>
            <p className="mt-2 text-sm text-muted">
              Visit our products page to try browsing the collection.
            </p>
            <Link
              to="/products"
              className="mt-5 inline-flex rounded-full bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-hover"
            >
              Browse products
            </Link>
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-border bg-surface p-8 text-center">
            <p className="font-semibold">Our collection is growing.</p>
            <p className="mt-2 text-sm text-muted">
              Check back soon for delicious new additions.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => {
              const type = product.types?.[0];
              const size = product.sizes?.length
                ? [...product.sizes].sort((a, b) => a.price - b.price)[0]
                : undefined;

              return (
                <Link
                  key={product.id}
                  to="/products"
                  className="group overflow-hidden rounded-2xl border border-border bg-surface transition duration-300 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <div className="overflow-hidden bg-background">
                    <img
                      src={type?.imageUrl || "/placeholder.png"}
                      alt={product.productname}
                      loading="lazy"
                      className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-5">
                    {product.category && (
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                        {product.category}
                      </p>
                    )}

                    <h3 className="mt-2 text-lg font-semibold">
                      {product.productname}
                    </h3>

                    <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-muted">
                      {type?.description || "A delicious treat to discover."}
                    </p>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <span className="font-bold text-primary">
                        {size ? `₪${size.price}` : "Explore"}
                      </span>

                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-text">
                        Discover
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Our story */}
      <section
        id="our-story"
        className="border-y border-border bg-surface"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-16 sm:px-8 md:py-20 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              A little about us
            </p>

            <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
              Good things start in the kitchen.
            </h2>

            <p className="mt-5 leading-7 text-muted">
              We believe baked goods can be both comforting and thoughtfully
              made. Our goal is to bring together flavors you love and
              ingredients chosen with care, creating treats that make
              everyday moments feel special.
            </p>

            <Link
              to="/products"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary-hover"
            >
              Find your favorite
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="rounded-[2rem] bg-background p-3 sm:p-5">
            <img
              src="/images/home-baking.jpg"
              alt="Baking ingredients prepared on a kitchen counter"
              loading="lazy"
              className="h-64 w-full rounded-2xl object-cover sm:h-80"
            />
          </div>
        </div>
      </section>

      {/* Final call to action */}
      <section className="px-5 py-16 sm:px-8 md:py-20">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-border bg-surface px-6 py-12 text-center shadow-sm sm:px-12 sm:py-16">
          <Sparkles className="mx-auto h-8 w-8 text-primary" />

          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            A little sweetness goes a long way.
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-muted">
            Find something delicious for your next coffee break, celebration,
            or just-because moment.
          </p>

          <Link
            to="/products"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-semibold text-white shadow-sm transition hover:bg-primary-hover"
          >
            Explore our collection
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-border bg-surface px-5 py-6 text-center text-sm text-muted">
        © {new Date().getFullYear()} Healthier & Delicious. Made with care.
      </footer>
    </main>
  );
}