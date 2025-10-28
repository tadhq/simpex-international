import { directusApi } from '@/lib/directus';
import { getDirectusFile } from '@/lib/directus/utils';
import { MotionDiv } from '@/lib/motion';
import { fadeInEaseProps } from '@/lib/motion/animations';
import { getLocale } from 'next-intl/server';
import Image from 'next/image';
import Copyright from './Copyright';
import Links from './Links';

interface Link {
  label: string;
  url: string;
}

export default async function Footer() {
  const locale = await getLocale();
  const footerSettings = await directusApi.getFooterSettings({ locale });

  const segments = [
    [footerSettings.translations.links_1_heading, footerSettings.translations.links_1],
    [footerSettings.translations.links_2_heading, footerSettings.translations.links_2],
    [footerSettings.translations.links_3_heading, footerSettings.translations.links_3],
    // [footerSettings.translations.links_4_heading, footerSettings.translations.links_4],
  ];

  return (
    <footer className="bg-gradient-to-b from-primary-500 to-[#02AAEA] rounded-tr-[40px] rounded-tl-[40px] text-white border-t">
      <MotionDiv className="container py-10" {...fadeInEaseProps}>
        <div className="flex flex-col items-center gap-4 w-full mt-8">
          <Image
            alt="Logo"
            height={0}
            src={getDirectusFile(footerSettings.footerLogo)}
            width={250}
          />
        </div>
        <hr className="my-6" />
        <div className="flex">
          <div className="grid grid-cols-1 ml-4 lg:ml-0 gap-y-8 lg:grid-cols-3 flex-grow lg:justify-items-center">
            {segments.map(([heading, links], index) => {
              return index === 1 ? (
                <div key={index} className="text-white">
                  <h4 className="font-bold mb-3">{typeof heading === 'string' ? heading : ''}</h4>
                  <div className="flex flex-col items-start gap-3">
                    {Array.isArray(links) &&
                      links.map((link: Link) => (
                        <p key={link.label} className="text-sm">
                          {link.label}
                        </p>
                      ))}
                  </div>
                </div>
              ) : (
                <Links
                  key={index}
                  heading={typeof heading === 'string' ? heading : ''}
                  links={Array.isArray(links) ? links : []}
                />
              );
            })}
          </div>
        </div>
      </MotionDiv>

      <MotionDiv className="container" {...fadeInEaseProps}>
        <hr />
        <div className="flex items-center gap-2 py-6 justify-center">
          <Copyright />
        </div>
      </MotionDiv>
    </footer>
  );
}
