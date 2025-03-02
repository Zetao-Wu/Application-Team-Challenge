"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { AppBar, Toolbar, Box } from "@mui/material";
import Logo from "../../../assets/logo_IntusCare.png";
import styles from "./Navbar.module.css";

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

const Navbar = () => {
  useEffect(() => {
    if (!document.querySelector("script[src*='translate.google.com']")) {
      const script = document.createElement("script");
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }

    window.googleTranslateElementInit = () => {
      if (!document.querySelector(".goog-te-combo") && window.google?.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages:
              "en,es,fr,de,zh-CN,ar,ru,ja,pt,hi,it,nl,ko,tr,sv,pl,fi,el,th,vi,he,id,ms,da,cs,ro,hu,uk,no,bg,hr,lt,sl,sk",
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          "google_translate_element"
        );
      }
    };

    if (window.google && window.google.translate) {
      window.googleTranslateElementInit();
    }
  }, []);

  return (
    <>
      <AppBar position="static" className={styles.navbar}>
        <Toolbar className={styles.toolbar}>
          <Box className={styles.logoContainer}>
            <Image src={Logo} alt="IntusCare Logo" width={160} height={50} priority />
          </Box>
          <Box className={styles.translateContainer}>
            <div id="google_translate_element" />
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
