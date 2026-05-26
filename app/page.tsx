"use client";

import { ChangeEvent, CSSProperties, useMemo, useState } from "react";
import {
  Check,
  MessageCircle,
  PenLine,
  Phone,
  Plus,
  RotateCcw,
  Trash2,
  Upload,
  User,
} from "lucide-react";

const sizes = ["4oz", "6oz", "8oz", "12oz"] as const;
type CupSize = (typeof sizes)[number];

type OrderModel = {
  id: number;
  size: CupSize;
  quantity: number;
};

const minimumQuantities: Record<CupSize, number> = {
  "4oz": 1000,
  "6oz": 3000,
  "8oz": 2000,
  "12oz": 1000,
};

const cupDimensions: Record<
  CupSize,
  { height: string; width: string; rim: number; bottom: string }
> = {
  "4oz": { height: "36%", width: "42%", rim: 26, bottom: "84%" },
  "6oz": { height: "43%", width: "46%", rim: 29, bottom: "81%" },
  "8oz": { height: "48%", width: "50%", rim: 31, bottom: "78%" },
  "12oz": { height: "62%", width: "54%", rim: 35, bottom: "70%" },
};

const whatsappNumber = "40748322673";

function getQuantityOptions(size: CupSize) {
  const minimum = minimumQuantities[size];
  return [1, 2, 3, 4].map((multiplier) => minimum * multiplier);
}

export default function Home() {
  const [models, setModels] = useState<OrderModel[]>([
    { id: 1, size: "8oz", quantity: minimumQuantities["8oz"] },
  ]);
  const [activeModelId, setActiveModelId] = useState(1);
  const [logoScale, setLogoScale] = useState(100);
  const [logoVertical, setLogoVertical] = useState(42);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoName, setLogoName] = useState("");
  const [clientName, setClientName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const activeModel = models.find((model) => model.id === activeModelId) ?? models[0];
  const activeCup = cupDimensions[activeModel.size];
  const totalQuantity = models.reduce((sum, model) => sum + model.quantity, 0);

  const whatsappHref = useMemo(() => {
    const modelLines = models.map(
      (model, index) =>
        `Model ${index + 1}: ${model.size}, ${model.quantity} buc. (minim ${
          minimumQuantities[model.size]
        } buc.)`,
    );
    const lines = [
      "Buna ziua, doresc o oferta pentru pahare personalizate.",
      "Pahar: alb",
      "Modele comandate:",
      ...modelLines,
      `Total: ${totalQuantity} buc.`,
      `Logo incarcat: ${logoName || "nu"}`,
      `Nume client: ${clientName || "-"}`,
      `Telefon: ${phone || "-"}`,
      `Mesaj: ${message || "-"}`,
    ];

    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      lines.join("\n"),
    )}`;
  }, [clientName, logoName, message, models, phone, totalQuantity]);

  function updateModel(id: number, changes: Partial<OrderModel>) {
    setModels((currentModels) =>
      currentModels.map((model) => {
        if (model.id !== id) {
          return model;
        }

        const nextSize = changes.size ?? model.size;
        const minimum = minimumQuantities[nextSize];
        const requestedQuantity =
          changes.quantity ?? (changes.size ? minimum : model.quantity);

        return {
          ...model,
          ...changes,
          size: nextSize,
          quantity: Math.max(requestedQuantity, minimum),
        };
      }),
    );
    setActiveModelId(id);
  }

  function addModel() {
    setModels((currentModels) => {
      const nextId = Math.max(...currentModels.map((model) => model.id)) + 1;
      const nextModel = {
        id: nextId,
        size: "4oz" as CupSize,
        quantity: minimumQuantities["4oz"],
      };

      setActiveModelId(nextId);
      return [...currentModels, nextModel];
    });
  }

  function removeModel(id: number) {
    setModels((currentModels) => {
      if (currentModels.length === 1) {
        return currentModels;
      }

      const nextModels = currentModels.filter((model) => model.id !== id);
      if (activeModelId === id) {
        setActiveModelId(nextModels[0].id);
      }
      return nextModels;
    });
  }

  function handleLogoUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      setLogoPreview(null);
      setLogoName("");
      return;
    }

    setLogoPreview(URL.createObjectURL(file));
    setLogoName(file.name);
  }

  function resetLogo() {
    setLogoPreview(null);
    setLogoName("");
    setLogoScale(100);
    setLogoVertical(42);
  }

  return (
    <main className="min-h-screen bg-white text-neutral-950">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-5 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between border-b border-neutral-200 pb-5">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-gold-700">
              Depozitul Online
            </p>
            <h1 className="mt-2 text-xl font-semibold tracking-normal sm:text-2xl">
              Configurator pahare personalizate
            </h1>
          </div>
          <div className="hidden h-px w-24 bg-gold-500 sm:block" />
        </header>

        <div className="grid flex-1 items-center gap-8 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <section className="order-2 lg:order-1">
            <div className="mb-7 max-w-2xl">
              <p className="text-sm uppercase tracking-[0.28em] text-gold-700">
                Luxury white cup
              </p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-normal sm:text-5xl lg:text-6xl">
                Pahar alb, logo-ul tau, oferta pe WhatsApp.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-neutral-600">
                Alege unul sau mai multe modele, incarca logo-ul si vezi instant
                cum arata pe un mockup minimalist, pregatit pentru cererea de
                oferta.
              </p>
            </div>

            <form className="space-y-6" onSubmit={(event) => event.preventDefault()}>
              <fieldset>
                <legend className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-neutral-800">
                  Modele comandate
                </legend>
                <div className="space-y-4">
                  {models.map((model, index) => (
                    <div
                      key={model.id}
                      className={`border p-4 transition ${
                        activeModelId === model.id
                          ? "border-gold-500 bg-gold-50/60 shadow-soft"
                          : "border-neutral-200 bg-white"
                      }`}
                      onClick={() => setActiveModelId(model.id)}
                    >
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                          <button
                            type="button"
                            onClick={() => setActiveModelId(model.id)}
                            className="text-left text-sm font-semibold uppercase tracking-[0.2em] text-neutral-900"
                          >
                            Model {index + 1}
                          </button>
                          <p className="mt-1 text-sm text-neutral-600">
                            {model.size} - {model.quantity} buc.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            removeModel(model.id);
                          }}
                          disabled={models.length === 1}
                          className="grid h-9 w-9 place-items-center border border-neutral-200 bg-white text-neutral-600 transition hover:border-gold-500 disabled:cursor-not-allowed disabled:opacity-35"
                          aria-label={`Sterge modelul ${index + 1}`}
                        >
                          <Trash2 size={16} aria-hidden="true" />
                        </button>
                      </div>

                      <div className="grid gap-4">
                        <div>
                          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">
                            Dimensiune
                          </span>
                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                            {sizes.map((size) => (
                              <button
                                type="button"
                                key={size}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  updateModel(model.id, { size });
                                }}
                                className={`h-11 border text-sm font-semibold transition ${
                                  model.size === size
                                    ? "border-gold-500 bg-white text-neutral-950 shadow-soft"
                                    : "border-neutral-200 bg-white text-neutral-700 hover:border-gold-300"
                                }`}
                                aria-pressed={model.size === size}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">
                            Cantitate minima: {minimumQuantities[model.size]} buc.
                          </span>
                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                            {getQuantityOptions(model.size).map((quantity) => (
                              <button
                                type="button"
                                key={quantity}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  updateModel(model.id, { quantity });
                                }}
                                className={`h-11 border text-sm font-semibold transition ${
                                  model.quantity === quantity
                                    ? "border-gold-500 bg-white text-neutral-950 shadow-soft"
                                    : "border-neutral-200 bg-white text-neutral-700 hover:border-gold-300"
                                }`}
                                aria-pressed={model.quantity === quantity}
                              >
                                {quantity} buc.
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </fieldset>

              <button
                type="button"
                onClick={addModel}
                className="inline-flex h-12 items-center justify-center gap-2 border border-gold-300 bg-white px-4 text-sm font-semibold text-neutral-900 transition hover:border-gold-500 hover:bg-gold-50"
              >
                <Plus size={17} aria-hidden="true" />
                Adauga model
              </button>

              <label className="group flex cursor-pointer items-center justify-between gap-4 border border-dashed border-gold-300 bg-white px-4 py-4 transition hover:border-gold-500 hover:bg-gold-50/60">
                <span className="flex min-w-0 items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center border border-gold-300 text-gold-700">
                    <Upload size={19} aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">
                      Incarca logo PNG/JPG
                    </span>
                    <span className="block truncate text-sm text-neutral-500">
                      {logoName ? logoName : "Selecteaza fisierul brandului tau"}
                    </span>
                  </span>
                </span>
                <input
                  className="sr-only"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleLogoUpload}
                />
              </label>
              <p className="-mt-3 text-sm leading-6 text-neutral-500">
                Logo-ul este folosit pentru previzualizare. Dupa deschiderea
                conversatiei pe WhatsApp, te rugam sa atasezi manual fisierul cu
                logo-ul.
              </p>

              {logoPreview && (
                <div className="grid gap-4 border border-neutral-200 bg-neutral-50 p-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">
                      Marime logo
                    </span>
                    <input
                      type="range"
                      min="70"
                      max="135"
                      value={logoScale}
                      onChange={(event) => setLogoScale(Number(event.target.value))}
                      className="w-full accent-gold-500"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">
                      Pozitie verticala
                    </span>
                    <input
                      type="range"
                      min="32"
                      max="58"
                      value={logoVertical}
                      onChange={(event) => setLogoVertical(Number(event.target.value))}
                      className="w-full accent-gold-500"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={resetLogo}
                    className="inline-flex h-11 items-center justify-center gap-2 border border-neutral-300 bg-white px-4 text-sm font-semibold text-neutral-800 transition hover:border-gold-500 sm:col-span-2 sm:w-max"
                  >
                    <RotateCcw size={17} aria-hidden="true" />
                    Reseteaza logo
                  </button>
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="relative block">
                  <User
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gold-700"
                    size={18}
                    aria-hidden="true"
                  />
                  <input
                    value={clientName}
                    onChange={(event) => setClientName(event.target.value)}
                    placeholder="Numele clientului"
                    className="h-14 w-full border border-neutral-200 bg-white py-3 pl-12 pr-4 text-sm outline-none transition placeholder:text-neutral-400 focus:border-gold-500"
                  />
                </label>
                <label className="relative block">
                  <Phone
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gold-700"
                    size={18}
                    aria-hidden="true"
                  />
                  <input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="Telefon"
                    className="h-14 w-full border border-neutral-200 bg-white py-3 pl-12 pr-4 text-sm outline-none transition placeholder:text-neutral-400 focus:border-gold-500"
                  />
                </label>
              </div>

              <label className="relative block">
                <PenLine
                  className="pointer-events-none absolute left-4 top-4 text-gold-700"
                  size={18}
                  aria-hidden="true"
                />
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Mesaj"
                  rows={4}
                  className="w-full resize-none border border-neutral-200 bg-white py-3 pl-12 pr-4 text-sm outline-none transition placeholder:text-neutral-400 focus:border-gold-500"
                />
              </label>

              <div className="grid gap-3 border-y border-neutral-200 py-4 text-sm sm:grid-cols-3">
                <div>
                  <span className="block text-xs uppercase tracking-[0.18em] text-neutral-500">
                    Modele
                  </span>
                  <strong className="mt-1 block font-semibold">{models.length}</strong>
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-[0.18em] text-neutral-500">
                    Total
                  </span>
                  <strong className="mt-1 block font-semibold">
                    {totalQuantity} buc.
                  </strong>
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-[0.18em] text-neutral-500">
                    Pahar
                  </span>
                  <strong className="mt-1 flex items-center gap-2 font-semibold">
                    <span className="h-3 w-3 rounded-full border border-neutral-200 bg-white" />
                    Alb
                  </strong>
                </div>
              </div>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-14 w-full items-center justify-center gap-3 bg-neutral-950 px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-gold-700 sm:w-auto"
              >
                <MessageCircle size={19} aria-hidden="true" />
                Cere oferta
              </a>
              <p className="-mt-3 text-sm leading-6 text-neutral-500">
                Mesajul se completeaza automat, iar logo-ul se trimite separat
                ca atasament in WhatsApp.
              </p>
            </form>
          </section>

          <section className="order-1 flex justify-center lg:order-2">
            <div className="relative w-full max-w-[520px] py-8">
              <div className="absolute left-1/2 top-1/2 h-[78%] w-[72%] -translate-x-1/2 -translate-y-1/2 border border-gold-200" />
              <div className="relative mx-auto flex aspect-[4/5] max-h-[620px] min-h-[430px] w-full items-center justify-center bg-white shadow-luxury">
                <div className="absolute left-8 top-8 text-xs uppercase tracking-[0.28em] text-gold-700">
                  {activeModel.size}
                </div>
                <div className="absolute right-8 top-8 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-neutral-500">
                  <Check size={14} aria-hidden="true" />
                  {activeModel.quantity} buc.
                </div>
                <div
                  className="relative min-w-[170px] transition-all duration-300"
                  style={{ height: activeCup.height, width: activeCup.width }}
                >
                  <div
                    className="cup-rim absolute left-1/2 top-0 z-20 w-[91%] -translate-x-1/2 border border-neutral-200 bg-white shadow-[inset_0_8px_16px_rgba(0,0,0,0.06)]"
                    style={{ height: activeCup.rim }}
                  />
                  <div
                    className="cup-shape absolute left-1/2 top-4 h-[92%] w-full -translate-x-1/2 overflow-hidden border border-neutral-200 bg-gradient-to-r from-neutral-50 via-white to-neutral-100 shadow-[28px_28px_55px_rgba(0,0,0,0.10)]"
                    style={{ "--cup-bottom": activeCup.bottom } as CSSProperties}
                  >
                    <div className="absolute inset-y-0 left-[12%] w-[16%] bg-white/70 blur-xl" />
                    <div className="absolute inset-y-0 right-[16%] w-[12%] bg-neutral-200/40 blur-xl" />
                    <div
                      className="absolute left-1/2 z-10 flex h-[96px] w-[136px] -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                      style={{
                        top: `${logoVertical}%`,
                        transform: `translate(-50%, -50%) scale(${logoScale / 100})`,
                      }}
                    >
                      {logoPreview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={logoPreview}
                          alt="Logo incarcat"
                          className="max-h-full max-w-full object-contain drop-shadow-sm"
                        />
                      ) : (
                        <span className="border-b border-neutral-950 pb-2 text-center text-xs uppercase tracking-[0.24em] text-neutral-950">
                          Logo
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-1/2 h-8 w-[58%] -translate-x-1/2 rounded-[50%] bg-neutral-300/35 blur-lg" />
                </div>
                <div className="absolute bottom-8 right-8 h-px w-20 bg-gold-500" />
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
