import React from "react";
import useSWR from "swr";
import { useCopyToClipboard } from "usehooks-ts";

import countOccurrences from "./utils/countOccurrences";
import fetcher from "./utils/fetcher";
import removeHTMLTags from "./utils/removeHTMLTags";

type Data = {
  DSEO: number;
  SOSEO: number;
  classification: any[];
  max: 0;
  result: {
    corpus: {
      [key: string]: {
        gap: [number, number, number, number, number];
        nbincorpus: number;
        score: number;
        serpData: {
          [key: string]: string;
        };
        textData: number;
        urlData: any[];
      };
    };
    textData: {
      isPerfect: boolean;
      nbMots: number;
      text?: any;
      valCorpus: number;
      valDoc: number;
    };
  };
};

const Content = () => {
  const [copiedValue, copy] = useCopyToClipboard();

  // eslint-disable-next-line quotes
  const csrfTokenElement = document.querySelector('meta[name="csrf-token"]');
  const csrfToken = csrfTokenElement?.getAttribute("content") as string;

  const contentElement = document.querySelector<
    HTMLTextAreaElement | HTMLInputElement
  >("textarea#contenu");
  const content = contentElement?.value as string;

  // TODO: Add error handling
  const { data, isLoading } = useSWR<Data, any, any>(
    `https://yourtext.guru${window.location.pathname}/textposition`,
    (url: string, options: RequestInit) =>
      fetcher<Data>(url, {
        ...options,
        method: "POST",
        headers: {
          "X-Csrf-Token": csrfToken,
          "X-Requested-With": "XMLHttpRequest",
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: `text=${encodeURIComponent(content)}&save=false`,
      }),
  );

  const maxHeight =
    37.5 +
    ((data && data.result && Object.keys(data.result.corpus).length) ?? 0) * 38;

  const [height, setHeight] = React.useState(37.5 + 5 * 38);
  const textContent = removeHTMLTags(content).toLowerCase();

  const handleSeeMore = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (height === maxHeight) {
      setHeight(37.5 + 5 * 38);
    } else {
      e.preventDefault();
      setHeight((prev) =>
        prev + 5 * 38 > maxHeight ? maxHeight : prev + 5 * 38,
      );
    }
  };

  const handleCopySub = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const sub = Object.entries(data!.result.corpus)
      .sort(([, a], [, b]) => b.score - a.score)
      .filter(([, value]) => value.textData < value.gap[1])
      .map(([key], _i) => key)
      .join(", ");
    copy(sub);
  };

  const handleCopyMiss = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const miss = Object.entries(data!.result.corpus)
      .sort(([, a], [, b]) => b.score - a.score)
      .filter(([, value]) => value.textData === 0)
      .map(([key], _i) => key)
      .join(", ");
    copy(miss);
  };

  const handleCopyOver = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const over = Object.entries(data!.result.corpus)
      .sort(([, a], [, b]) => b.score - a.score)
      .filter(([, value]) => value.textData > value.gap[3])
      .map(([key], _i) => key)
      .join(", ");
    copy(over);
  };

  return (
    <div className={"card mb-2 mt-4"}>
      <div
        className={"card-body d-flex flex-column h-100 w-100 position-relative"}
      >
        <div
          className={
            "d-flex flex-row align-items-center mb-3 justify-content-between"
          }
        >
          <div className={"row g-0"}>
            <div className={"col-auto"}>
              <div className={"d-inline-block position-relative"}>
                <img
                  src={chrome.runtime.getURL("logo.svg")}
                  width={24}
                  height={24}
                  alt={"YTG Ninja Logo"}
                />
              </div>
            </div>
            <div className={"col"}>
              <div
                className={
                  "card-body d-flex flex-row pt-0 pb-0 pe-0 pe-0 ps-2 h-100 align-items-center justify-content-between"
                }
              >
                <div className={"d-flex flex-column"}>
                  <div className={"name"}>
                    {"Ninja ("}
                    <a
                      href={"#ytg-ninja"}
                      onClick={(e) => {
                        e.preventDefault();
                        copy(
                          Object.entries(data!.result.corpus)
                            .sort(([, a], [, b]) => b.score - a.score)
                            .map(([key], _i) => key)
                            .join(", "),
                        );
                      }}
                    >
                      {"copy"}
                    </a>
                    {")"}
                    {copiedValue ===
                      (data &&
                        data.result &&
                        Object.entries(data.result.corpus)
                          .sort(([, a], [, b]) => b.score - a.score)
                          .map(([key], _i) => key)
                          .join(", ")) && " ✅"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={"row g-0"}>
            <a
              href={
                "https://arkee.fr/?utm_source=ytg-ninja&utm_medium=extension&utm_campaign=ytg-ninja&utm_content=logo"
              }
              target={"_blank"}
              rel={"noopener noreferrer"}
            >
              <img
                src={chrome.runtime.getURL("arkee.png")}
                height={24}
                width={38}
                alt={"Arkée Logo"}
              />
            </a>
          </div>
        </div>

        <div className={"separator-light mb-3"} />
        {isLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height,
            }}
          >
            <div className={"spinner-border"} role={"status"}>
              <span className={"visually-hidden"}>{"Loading..."}</span>
            </div>
          </div>
        ) : (
          <div
            className={"mb-n2 scroll-out"}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <div style={{ height: `${height}px`, overflowY: "hidden" }}>
              <table className={"table table-striped"}>
                <thead>
                  <tr>
                    <th>{"Keyword"}</th>
                    <th style={{ textAlign: "center" }}>{"Occurrences"}</th>
                    <th style={{ textAlign: "center" }}>
                      {"Added"}{" "}
                      <span
                        style={{
                          fontSize: "0.5em",
                          verticalAlign: "super",
                          marginLeft: "-4px",
                        }}
                      >
                        {"beta"}
                      </span>
                    </th>
                    <th style={{ textAlign: "center" }}>{"Total"}</th>
                  </tr>
                </thead>
                <tbody>
                  {data &&
                    data.result &&
                    Object.keys(data.result.corpus).length > 0 &&
                    Object.entries(data.result.corpus)
                      .sort(([, a], [, b]) => b.score - a.score)
                      .map(([key, value], i) => {
                        const occurrences = countOccurrences(textContent, key);
                        let added =
                          (((value.gap[1] + value.gap[2]) / 2) * occurrences) /
                            value.textData -
                          occurrences;
                        // il faut arrondir à l'entier
                        added = Math.round(added);
                        added = isNaN(added) ? 0 : isFinite(added) ? added : 0;
                        const total = occurrences + added;
                        return (
                          <tr key={i}>
                            <td>{key}</td>
                            <td style={{ textAlign: "center" }}>
                              {occurrences}
                            </td>
                            <td style={{ textAlign: "center" }}>
                              {added === 0 ? "-" : added}
                            </td>
                            <td style={{ textAlign: "center" }}>{total}</td>
                          </tr>
                        );
                      })}
                </tbody>
              </table>
            </div>
            <span
              style={{
                marginTop: "8px",
              }}
            >
              <a href={"#ytg-ninja"} onClick={handleSeeMore}>
                <i
                  className={
                    height === maxHeight ? "fa fa-minus" : "fa fa-plus"
                  }
                />{" "}
                {"see "}
                {height === maxHeight ? "less" : "more"}
              </a>
              {height !== maxHeight && (
                <>
                  {" ("}
                  <a
                    href={"#ytg-ninja"}
                    onClick={(e) => {
                      e.preventDefault();
                      setHeight(maxHeight);
                    }}
                  >
                    {"all"}
                  </a>
                  {")"}
                </>
              )}
            </span>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginTop: "8px",
              }}
            >
              <button
                className={`btn btn-${
                  data &&
                  copiedValue ===
                    Object.entries(data.result.corpus)
                      .sort(([, a], [, b]) => b.score - a.score)
                      .filter(([, value]) => value.textData < value.gap[1])
                      .map(([key], _i) => key)
                      .join(", ")
                    ? "success"
                    : "primary"
                }`}
                onClick={handleCopySub}
              >
                {"copy sub"}
              </button>
              <button
                className={`btn btn-${
                  data &&
                  copiedValue ===
                    Object.entries(data.result.corpus)
                      .sort(([, a], [, b]) => b.score - a.score)
                      .filter(([, value]) => value.textData === 0)
                      .map(([key], _i) => key)
                      .join(", ")
                    ? "success"
                    : "primary"
                }`}
                onClick={handleCopyMiss}
              >
                {"copy miss"}
              </button>
              <button
                className={`btn btn-${
                  data &&
                  copiedValue ===
                    Object.entries(data.result.corpus)
                      .sort(([, a], [, b]) => b.score - a.score)
                      .filter(([, value]) => value.textData > value.gap[3])
                      .map(([key], _i) => key)
                      .join(", ")
                    ? "success"
                    : "primary"
                }`}
                onClick={handleCopyOver}
              >
                {"copy over"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Content;
