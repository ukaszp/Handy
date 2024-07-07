import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQComponent = () => {
  return (
    <div className="p-3 mt-10">
      <h1 className="text-4xl font-bold text-teal-600 py-3">
        Często zadawane pytania
      </h1>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Jak to działa?</AccordionTrigger>
          <AccordionContent className=" text-base">
          Nasza aplikacja umożliwia szybkie i łatwe wyszukiwanie fachowców do różnych rodzajów napraw i remontów. Wystarczy wpisać nazwę usługi, miasto, lub zakres działania, aby zobaczyć listę dostępnych ekspertów.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Jakie usługi mogę znaleźć za pomocą tej aplikacji?</AccordionTrigger>
          <AccordionContent className=" text-base">
            Nasza aplikacja umożliwia znalezienie fachowców oferujących różnorodne usługi remontowe i naprawcze, takie jak elektryka, hydraulika, stolarstwo, malowanie, czy też remonty łazienek i kuchni.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Jakie są korzyści z rejestracji jako fachowiec na tej platformie?</AccordionTrigger>
          <AccordionContent className=" text-base">
          Rejestracja jako fachowiec umożliwia dotarcie do nowych klientów, promowanie swoich usług, wybór zleceń i terminów pracy, oraz rozwój własnego biznesu.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>Jak mogę dokonać płatności za usługi fachowców?</AccordionTrigger>
          <AccordionContent>
          Płatności za usługi fachowców mogą być dokonywane gotówką lub przelewem bankowym, w zależności od preferencji fachowca.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger>Czy mogę negocjować cenę usługi z fachowcem?</AccordionTrigger>
          <AccordionContent className=" text-base">
          Tak, wiele zleceniodawców i fachowców umawia się na konkretne ceny przed rozpoczęciem pracy. Możesz swobodnie negocjować warunki usługi.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FAQComponent;
