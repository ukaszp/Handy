import { Facebook } from "lucide-react";
import { Instagram } from "lucide-react";
import { Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-20 pt-5 border border-t-1">
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10
      text-center text-gray-500 pt-2 text-sm pb-8"
      >
        <div className=" flex flex-col">
          <span>Kontakt:</span>
          <span>contact@hany.pl</span>
          <span>(+48) 792 555 328</span>
        </div>
        <div className=" flex flex-col">
          <span>Adres:</span>
          <span>ul. Kosiarzy 22B</span>
          <span>02-956 Warszawa</span>
        </div>
        <div>
          <div className="flex flex-row space-x-4 text-slate-500">
            <a href="https://www.facebook.com/">
              <Facebook />
            </a>
            <a href="https://www.instagram.com/">
              <Instagram />
            </a>
            <a href="https://github.com/ukaszp">
              <Github />
            </a>
          </div>
        </div>
      </div>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10
      text-center pt-2 text-gray-400 text-sm pb-8"
      >
        <span>© 2024 Handy All rights reserved.</span>
        <span>Terms · Privacy Policy</span>
      </div>
    </footer>
  );
};

export default Footer;
