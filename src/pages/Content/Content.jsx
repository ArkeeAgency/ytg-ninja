import React from 'react';
import useSWR from 'swr';

import fetcher from './utils/fetcher';
import removeHTMLTags from './utils/removeHTMLTags';
import { useCopyToClipboard } from 'usehooks-ts';
import countOccurrences from './utils/countOccurrences';

const Content = () => {
  const [copiedValue, copy] = useCopyToClipboard();
  const csrfTokenElement = document.querySelector('meta[name="csrf-token"]');
  const csrfToken = csrfTokenElement.getAttribute('content');

  const contentElement = document.querySelector('textarea#contenu');
  const content = contentElement.value;

  const { data, error, isLoading } = useSWR(
    `https://yourtext.guru${window.location.pathname}/textposition`,
    (url, options) =>
      fetcher(url, {
        ...options,
        method: 'POST',
        headers: {
          'X-Csrf-Token': csrfToken,
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: `text=${encodeURIComponent(content)}&save=false`,
      })
  );

  const maxHeight =
    37.5 +
    ((data && data.result && Object.keys(data.result.corpus).length) ?? 0) * 38;

  const [height, setHeight] = React.useState(37.5 + 5 * 38);
  const textContent = removeHTMLTags(content).toLowerCase();

  const handleSeeMore = (e) => {
    if (height === maxHeight) {
      setHeight(37.5 + 5 * 38);
    } else {
      e.preventDefault();
      setHeight((prev) =>
        prev + 5 * 38 > maxHeight ? maxHeight : prev + 5 * 38
      );
    }
  };

  return (
    <div className="card mb-2 mt-4">
      <div className="card-body d-flex flex-column h-100 w-100 position-relative">
        <div className="d-flex flex-row align-items-center mb-3">
          <div className="row g-0 align-self-start" id="contactTitle">
            <div className="col-auto">
              <div className="d-inline-block position-relative">
                <Icon width="24" height="24" />
              </div>
            </div>
            <div className="col">
              <div className="card-body d-flex flex-row pt-0 pb-0 pe-0 pe-0 ps-2 h-100 align-items-center justify-content-between">
                <div className="d-flex flex-column">
                  <div className="name">
                    Ninja (
                    <a
                      href={'#'}
                      onClick={(e) => {
                        e.preventDefault();
                        copy(
                          Object.entries(data.result.corpus)
                            .sort(([, a], [, b]) => b.score - a.score)
                            .map(([key], i) => key)
                            .join(', ')
                        );
                      }}
                    >
                      copy
                    </a>
                    ){!!copiedValue && ' ✅'}
                  </div>
                  <div className="text-small text-muted last"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="separator-light mb-3"></div>
        {isLoading ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height,
            }}
          >
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div
            className="mb-n2 scroll-out"
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ height: `${height}px`, overflowY: 'hidden' }}>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Keyword</th>
                    <th style={{ textAlign: 'center' }}>Occurrences</th>
                    <th style={{ textAlign: 'center' }}>
                      Added{' '}
                      <span
                        style={{
                          fontSize: '0.5em',
                          verticalAlign: 'super',
                          marginLeft: '-4px',
                        }}
                      >
                        beta
                      </span>
                    </th>
                    <th style={{ textAlign: 'center' }}>Total</th>
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
                            <td style={{ textAlign: 'center' }}>
                              {occurrences}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              {added === 0 ? '-' : added}
                            </td>
                            <td style={{ textAlign: 'center' }}>{total}</td>
                          </tr>
                        );
                      })}
                </tbody>
              </table>
            </div>
            <span
              style={{
                marginTop: '8px',
              }}
            >
              <a href="#ytg-ninja" onClick={handleSeeMore}>
                <i
                  className={
                    height === maxHeight ? 'fa fa-minus' : 'fa fa-plus'
                  }
                ></i>{' '}
                see {height === maxHeight ? 'less' : 'more'}
              </a>
              {height !== maxHeight && (
                <>
                  {' ('}
                  <a
                    href="#ytg-ninja"
                    onClick={(e) => {
                      e.preventDefault();
                      setHeight(maxHeight);
                    }}
                  >
                    all
                  </a>
                  {')'}
                </>
              )}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const Icon = (props) => (
  <svg
    width="1080"
    height="1080"
    viewBox="0 0 1080 1080"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M445.063 867.5L368.187 901.5L207.188 537.312L284.062 503.312L445.063 867.5Z"
      fill="url(#paint0_linear_682_3)"
    />
    <path
      d="M233.875 572.125C236.688 566.125 240.438 562 244.375 558.5C248.375 555.063 252.687 552.375 257.25 550.313C261.932 548.218 266.906 546.848 272 546.25C277.25 545.688 282.812 545.75 289.125 547.688C286.312 553.75 282.625 557.812 278.625 561.375C274.736 564.722 270.377 567.48 265.688 569.563C260.992 571.608 256.023 572.956 250.937 573.563C245.812 574.125 240.25 574.125 233.875 572.125Z"
      fill="#FFC107"
    />
    <path
      d="M276.938 669.438C279.75 663.438 283.5 659.313 287.438 655.813C291.438 652.375 295.75 649.688 300.312 647.625C304.995 645.531 309.968 644.161 315.063 643.563C320.313 643 325.875 643.063 332.188 645C329.375 651.063 325.687 655.125 321.687 658.687C317.798 662.034 313.439 664.793 308.75 666.875C304.055 668.921 299.085 670.268 294 670.875C288.812 671.438 283.312 671.375 276.938 669.438Z"
      fill="#FFC107"
    />
    <path
      d="M248.25 604.563C251.062 598.563 254.813 594.438 258.75 590.938C262.75 587.5 267.062 584.812 271.625 582.75C276.307 580.656 281.281 579.286 286.375 578.688C291.625 578.125 297.188 578.187 303.5 580.125C300.688 586.187 297 590.25 293 593.813C289.111 597.159 284.752 599.918 280.063 602C275.367 604.046 270.398 605.393 265.312 606C260.125 606.562 254.625 606.5 248.25 604.563Z"
      fill="#FFC107"
    />
    <path
      d="M305.625 734.312C308.437 728.312 312.188 724.188 316.125 720.688C320.125 717.25 324.437 714.562 329 712.5C333.682 710.406 338.656 709.036 343.75 708.437C349 707.875 354.5 707.937 360.875 709.875C358.063 715.937 354.375 720 350.375 723.563C346.486 726.909 342.127 729.668 337.438 731.75C332.742 733.796 327.773 735.143 322.687 735.75C317.5 736.312 312 736.25 305.625 734.312Z"
      fill="#FFC107"
    />
    <path
      d="M291.25 701.875C294.062 695.875 297.812 691.75 301.75 688.25C305.75 684.813 310.062 682.125 314.625 680.063C319.307 677.968 324.281 676.598 329.375 676C334.625 675.438 340.125 675.5 346.5 677.438C343.688 683.5 340 687.563 336 691.125C332.111 694.472 327.752 697.23 323.063 699.313C318.367 701.358 313.398 702.706 308.312 703.313C303.125 703.875 297.625 703.813 291.25 701.875Z"
      fill="#FFC107"
    />
    <path
      d="M348.625 831.625C351.5 825.625 355.188 821.5 359.125 818C363.125 814.563 367.437 811.875 372 809.812C376.682 807.718 381.656 806.348 386.75 805.75C392 805.187 397.5 805.25 403.875 807.187C401.063 813.25 397.375 817.313 393.375 820.875C389.375 824.313 385.062 827 380.5 829.062C375.805 831.108 370.835 832.456 365.75 833.062C360.5 833.625 355 833.563 348.625 831.625Z"
      fill="#FFC107"
    />
    <path
      d="M262.562 637C265.375 631 269.125 626.875 273.063 623.375C277.063 619.937 281.375 617.25 285.937 615.187C290.62 613.093 295.593 611.723 300.687 611.125C305.937 610.562 311.5 610.625 317.813 612.562C315 618.625 311.312 622.688 307.312 626.25C303.423 629.597 299.064 632.355 294.375 634.437C289.68 636.483 284.71 637.831 279.625 638.437C274.437 639 268.937 638.937 262.562 637Z"
      fill="#FFC107"
    />
    <path
      d="M334.312 799.188C337.125 793.188 340.875 789.063 344.813 785.563C348.813 782.125 353.125 779.438 357.688 777.375C362.37 775.281 367.343 773.911 372.437 773.313C377.687 772.75 383.188 772.813 389.563 774.75C386.75 780.813 383.062 784.875 379.062 788.438C375.062 791.875 370.75 794.563 366.187 796.625C361.492 798.671 356.523 800.018 351.438 800.625C346.188 801.188 340.625 801.125 334.312 799.188Z"
      fill="#FFC107"
    />
    <path
      d="M319.938 766.75C322.75 760.75 326.5 756.625 330.437 753.125C334.437 749.687 338.75 747 343.312 744.937C347.995 742.843 352.968 741.473 358.062 740.875C363.312 740.312 368.813 740.375 375.188 742.312C372.375 748.375 368.687 752.437 364.687 756C360.687 759.437 356.375 762.125 351.812 764.187C347.117 766.233 342.148 767.581 337.062 768.187C331.812 768.75 326.312 768.687 319.938 766.75Z"
      fill="#FFC107"
    />
    <path
      d="M285.875 514.063L214.5 545.625C205.875 549.438 195.875 545.563 192.063 536.938C188.25 528.313 192.125 518.313 200.75 514.5L272.125 482.938C280.75 479.125 290.75 483 294.562 491.625C298.375 500.188 294.5 510.25 285.875 514.063Z"
      fill="#FFA000"
    />
    <g opacity="0.81">
      <path
        d="M318.875 787L275.312 689.687L344.562 643.5L398.188 754.563L318.875 787Z"
        fill="url(#paint1_linear_682_3)"
      />
    </g>
    <path
      d="M195.875 542.313C201.563 548.563 211.375 546.812 211.375 546.812L214.125 553L291.125 519.313L288.438 512.937C288.438 512.937 296.562 507.375 295.875 496.312L195.875 542.313Z"
      fill="url(#paint2_linear_682_3)"
    />
    <path
      d="M230.625 895.438V914.062H889.375V895.438C889.375 789.125 722.437 736.5 560 736.688C398.562 736.875 230.625 782.813 230.625 895.438Z"
      fill="url(#paint3_linear_682_3)"
    />
    <path
      d="M276.625 773.25C276.625 831.688 368.938 914.063 368.938 914.063H740.563C740.563 914.063 826.063 829.438 826.063 760.438C826.063 760.438 731.25 733.25 560 736.688C368.937 740.5 276.625 773.25 276.625 773.25Z"
      fill="#413793"
    />
    <g filter="url(#filter0_d_682_3)">
      <path
        d="M589.688 755.375C700.813 755.375 775.312 768.5 805.562 775.063C797.125 819 754.875 871.375 732.5 895.062H376.25C347.062 867.812 307 821.188 297.625 786.812C330.125 778 416.938 758.563 560.375 755.688C570.188 755.5 580 755.375 589.688 755.375ZM589.688 736.375C580.062 736.375 570.188 736.438 560 736.688C369 740.5 276.625 773.25 276.625 773.25C276.625 831.688 368.938 914.062 368.938 914.062H740.562C740.562 914.062 826.062 829.437 826.062 760.437C826.062 760.437 742.125 736.375 589.688 736.375Z"
        fill="url(#paint4_linear_682_3)"
      />
    </g>
    <path
      d="M467.812 749.375C467.812 730.75 469.063 698 491.375 687.562C506.813 680.375 610.5 684.062 626.5 692.312C646.75 702.75 652.187 731.75 652.187 749.312C652.187 780.812 610.937 875.187 560.062 875.187C509.187 875.187 467.812 780.875 467.812 749.375Z"
      fill="url(#paint5_linear_682_3)"
    />
    <path
      opacity="0.61"
      d="M473.937 702.375L469.625 723C469.625 723 501.937 762.062 560 762.062C627.062 762.062 649.75 728.062 649.75 728.062L643.937 708.75L473.937 702.375Z"
      fill="black"
    />
    <path
      d="M620.312 914.062C666.5 863.625 709.438 803.562 722.25 744.625L673.75 731.813C667.625 730.188 661.375 733.687 659.5 739.687C641.438 797.937 580.062 863.812 524.188 914.062H620.312Z"
      fill="black"
    />
    <path
      d="M607.438 914.187C655.688 862.562 701.563 800.062 714.875 738.812L666.375 726C660.25 724.375 654 727.875 652.125 733.875C633.313 794.437 567.688 863.312 510.062 914.187H607.438Z"
      fill="url(#paint6_linear_682_3)"
    />
    <g opacity="0.31">
      <path
        d="M469 738.312C469 738.312 543.125 848.625 632.875 911.437C632.875 911.437 582.437 917.25 581 914.062C579.562 910.875 472.938 794.25 472.938 794.25L469 738.312Z"
        fill="black"
      />
    </g>
    <path
      d="M606.688 914.063C551.313 864.5 489.125 797.813 469 738.313C466.375 730.5 458.125 726.188 450.313 728.75L402 745.063C415.25 804.75 459.188 864.5 506 914.063H606.688Z"
      fill="url(#paint7_linear_682_3)"
    />
    <path
      d="M560 198.688C449.75 198.688 347.688 316.563 347.688 486.25C347.688 655 452.875 731.437 560 731.437C667.125 731.437 772.313 655 772.313 486.25C772.313 316.563 670.25 198.688 560 198.688Z"
      fill="#FFCA28"
    />
    <path
      d="M455.875 533.438C473.099 533.438 487.062 518.971 487.062 501.125C487.062 483.279 473.099 468.812 455.875 468.812C438.651 468.812 424.688 483.279 424.688 501.125C424.688 518.971 438.651 533.438 455.875 533.438Z"
      fill="#404040"
    />
    <path
      d="M664.125 533.438C681.349 533.438 695.313 518.971 695.313 501.125C695.313 483.279 681.349 468.812 664.125 468.812C646.901 468.812 632.938 483.279 632.938 501.125C632.938 518.971 646.901 533.438 664.125 533.438Z"
      fill="#404040"
    />
    <path
      d="M502.875 444.125C497 436.375 483.437 425.062 457.062 425.062C430.687 425.062 417.125 436.375 411.25 444.125C408.625 447.562 409.312 451.562 411.125 453.937C412.812 456.187 417.75 458.25 423.187 456.375C428.625 454.5 439.25 449 457.125 448.875C474.937 449 485.562 454.5 491.062 456.375C496.5 458.25 501.437 456.187 503.125 453.937C504.812 451.562 505.5 447.562 502.875 444.125Z"
      fill="#6D4C41"
    />
    <path
      d="M708.75 444.125C702.875 436.375 689.312 425.062 662.937 425.062C636.562 425.062 623 436.375 617.125 444.125C614.5 447.562 615.188 451.562 617 453.937C618.688 456.187 623.625 458.25 629.063 456.375C634.5 454.5 645.125 449 663 448.875C680.813 449 691.438 454.5 696.938 456.375C702.375 458.25 707.313 456.187 709 453.937C710.688 451.562 711.313 447.562 708.75 444.125Z"
      fill="#6D4C41"
    />
    <path
      opacity="0.17"
      d="M560 190.312C442.937 190.312 347.688 268.938 347.688 447.625C347.688 627.313 439.562 725.562 560 725.562C680.437 725.562 782.5 625 782.5 445.25C782.438 266.563 677.062 190.312 560 190.312ZM560 710.562C481.125 710.562 376.812 669.937 376.812 522.875C376.812 376.625 464.5 380.625 560 380.625C655.5 380.625 743.188 376.625 743.188 522.875C743.188 669.937 638.875 710.562 560 710.562Z"
      fill="black"
    />
    <path
      d="M562.312 520.25C632 520.25 756.625 587.062 756.625 587.062C752.813 650.937 669.625 724.437 566.75 722.937C394.125 720.437 363.312 592.187 363.312 592.187C363.312 592.187 492.625 520.25 562.312 520.25Z"
      fill="url(#paint8_linear_682_3)"
    />
    <path
      opacity="0.4"
      d="M756.437 589.625C756.437 589.438 756.5 589.25 756.5 589.125C749.875 585.188 743.187 581.063 736.437 576.813C698.25 558.063 614.75 520.312 562.375 520.312C514.125 520.312 432.75 556 382.75 582.188C372.75 588.875 378.5 589.5 368.812 595.625C401.562 584.125 495.937 541.5 560.937 541.5C624.75 541.437 721.5 578.375 756.437 589.625Z"
      fill="#BDBDBD"
    />
    <path
      d="M560 165C437.812 165 317.812 253.375 317.812 432.125C317.812 611.812 434.25 736.688 559.938 736.688C685.625 736.688 802.063 611.812 802.063 432.125C802.125 253.375 682.188 165 560 165ZM560 722.812C477.625 722.812 368.813 644.625 368.813 497.562C368.813 351.312 460.312 355.312 560 355.312C659.688 355.312 751.188 351.312 751.188 497.562C751.188 644.562 642.313 722.812 560 722.812Z"
      fill="url(#paint9_linear_682_3)"
    />
    <path
      d="M566.75 225.75C566.75 225.75 476.5 197.688 394.125 286.375C315.125 371.437 339.75 534 339.75 534C339.75 534 331.375 392.312 424.625 303.625C506.187 226 566.75 225.75 566.75 225.75Z"
      fill="url(#paint10_linear_682_3)"
    />
    <path
      d="M718.375 347.125C771 398.25 771.75 534.5 771.75 534.5C771.75 534.5 811.188 397.312 738.938 323.375C679.188 262.187 596.438 286.937 596.438 286.937C596.438 286.937 662.938 293.25 718.375 347.125Z"
      fill="url(#paint11_linear_682_3)"
    />
    <path
      d="M560 177.5C620.625 177.5 676.813 199.875 718.125 240.438C764.938 286.375 789.625 352.625 789.625 432.125C789.625 509.438 767 580.938 725.75 634.875C748.75 598.562 763.688 552.625 763.688 497.625C763.688 430.125 743.813 386.312 702.875 363.562C668.438 344.438 624.5 342.875 574.813 342.875H545.313C461.125 342.875 356.375 342.875 356.375 497.625C356.375 552.688 371.25 598.562 394.312 634.875C353.062 580.938 330.437 509.438 330.437 432.125C330.437 352.688 355.187 286.375 401.938 240.438C443.188 199.875 499.375 177.5 560 177.5ZM560 165C437.812 165 317.812 253.375 317.812 432.125C317.812 611.812 434.25 736.688 559.938 736.688C685.625 736.688 802.063 611.812 802.063 432.125C802.125 253.375 682.188 165 560 165ZM560 355.312H574.75C664.938 355.312 751.188 358.875 751.188 497.562C751.188 644.562 638.688 722.812 560 722.812C481.312 722.812 368.813 644.562 368.813 497.562C368.813 358.875 455.062 355.312 545.25 355.312H560Z"
      fill="white"
    />
    <defs>
      <filter
        id="filter0_d_682_3"
        x="272.625"
        y="736.375"
        width="557.438"
        height="185.688"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_682_3"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_682_3"
          result="shape"
        />
      </filter>
      <linearGradient
        id="paint0_linear_682_3"
        x1="261.456"
        y1="563.844"
        x2="350.825"
        y2="755.337"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="white" />
        <stop offset="1" stop-color="white" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_682_3"
        x1="363.8"
        y1="787.681"
        x2="315.013"
        y2="669.462"
        gradientUnits="userSpaceOnUse"
      >
        <stop />
        <stop offset="1" stop-opacity="0" />
      </linearGradient>
      <linearGradient
        id="paint2_linear_682_3"
        x1="254.288"
        y1="539.719"
        x2="245.887"
        y2="519.363"
        gradientUnits="userSpaceOnUse"
      >
        <stop />
        <stop offset="1" stop-opacity="0" />
      </linearGradient>
      <linearGradient
        id="paint3_linear_682_3"
        x1="559.994"
        y1="924.612"
        x2="559.994"
        y2="843.313"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.17" stop-color="#413793" />
        <stop offset="1" stop-color="#413793" stop-opacity="0.6" />
      </linearGradient>
      <linearGradient
        id="paint4_linear_682_3"
        x1="551.331"
        y1="736.388"
        x2="551.331"
        y2="914.05"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="white" />
        <stop offset="0.265" stop-color="white" />
        <stop offset="0.754" stop-color="white" />
        <stop offset="1" stop-color="white" />
      </linearGradient>
      <linearGradient
        id="paint5_linear_682_3"
        x1="559.994"
        y1="724.019"
        x2="559.994"
        y2="862.325"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.074" stop-color="#444444" />
        <stop offset="0.653" stop-color="#413793" />
      </linearGradient>
      <linearGradient
        id="paint6_linear_682_3"
        x1="672.688"
        y1="747.194"
        x2="603.513"
        y2="854.556"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="white" />
        <stop offset="1" stop-color="white" />
      </linearGradient>
      <linearGradient
        id="paint7_linear_682_3"
        x1="509.413"
        y1="852.894"
        x2="407.612"
        y2="706.713"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="white" />
        <stop offset="1" stop-color="white" />
      </linearGradient>
      <linearGradient
        id="paint8_linear_682_3"
        x1="559.988"
        y1="584.662"
        x2="559.988"
        y2="736.081"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.074" stop-color="white" />
        <stop offset="0.653" stop-color="white" />
      </linearGradient>
      <linearGradient
        id="paint9_linear_682_3"
        x1="559.988"
        y1="168.2"
        x2="559.988"
        y2="730.012"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.074" stop-color="#413793" />
        <stop offset="0.653" stop-color="#212121" />
      </linearGradient>
      <linearGradient
        id="paint10_linear_682_3"
        x1="369.944"
        y1="406.188"
        x2="505.081"
        y2="239.381"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#0D0C0C" />
        <stop offset="1" stop-color="#0D0C0C" stop-opacity="0" />
      </linearGradient>
      <linearGradient
        id="paint11_linear_682_3"
        x1="735.325"
        y1="405.037"
        x2="642.419"
        y2="295.237"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#0D0C0C" />
        <stop offset="1" stop-color="#0D0C0C" stop-opacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

export default Content;
