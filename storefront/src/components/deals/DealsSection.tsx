import { getShopSettings } from '@/lib/directus/api';
import { getProductDeals } from '@/lib/directus/api/deals';
import { DirectusFile } from '@/lib/directus/types';
import { getDirectusFile } from '@/lib/directus/utils';
import { MotionDiv } from '@/lib/motion';
import { fadeInUpEaseProps } from '@/lib/motion/animations';
import Image from 'next/image';
import DealsProductCarousel from './DealsProductCarousel';
import FeaturedDeals from './FeaturedDeals';

interface Props {
  image_banner_hero: DirectusFile;
  image_banner_square: DirectusFile;
  image_banner_long: DirectusFile;
}

export default function DealsSection({
  image_banner_hero,
  image_banner_square,
  image_banner_long,
}: Props) {
  return (
    <MotionDiv
      {...fadeInUpEaseProps}
      transition={{
        ...fadeInUpEaseProps.transition,
        delay: 0.1,
      }}
    >
      <HeroBannerBlock image={image_banner_hero} />
      <DealsSliderBlock />
      <DoublePromoBannerBlock imageLong={image_banner_long} imageSquare={image_banner_square} />
      <FeaturedDealsSection />
    </MotionDiv>
  );
}

function HeroBannerBlock({ image }: { image: DirectusFile }) {
  return (
    <section className="bg-white py-4 -mt-4 md:py-10 md:-mt-12">
      <div className="container">
        <div className="w-full overflow-hidden rounded-xl lg:rounded-[20px]">
          <Image
            //   blurOnLoad
            alt="Hero Deals Banner"
            className="object-contain"
            height="1248"
            layout="responsive"
            src={getDirectusFile(image)}
            width="3280"
          />
        </div>
      </div>
    </section>
  );
}

async function DealsSliderBlock() {
  const shopSettings = await getShopSettings();
  const deals = await getProductDeals();
  const featured_deals = (
    (deals?.[0]?.product_deals as { handle: string; deal_price?: number }[]) || []
  ).map((deal) => ({
    handle: deal.handle,
    deal_price: deal.deal_price,
  }));

  return (
    <div className="container py-8">
      <DealsProductCarousel featured_deals={featured_deals} />
    </div>
  );
}

function DoublePromoBannerBlock({
  imageSquare,
  imageLong,
}: {
  imageSquare: DirectusFile;
  imageLong: DirectusFile;
}) {
  return (
    <section className="mb-4 md:px-4 lg:mb-6 bg-white py-4 md:py-10">
      <div className="container">
        <div className="flex flex-col gap-4 md:flex-row lg:gap-8">
          {/* <MotionDiv
            {...fadeInUpEaseProps}
            transition={{
              ...fadeInUpEaseProps.transition,
              delay: 0.1,
            }}
          > */}
          <div className="h-full w-full overflow-hidden rounded-xl lg:rounded-[20px] md:w-2/5">
            <Image
              //   blurOnLoad
              alt="Square Deals Banner"
              className="h-auto flex-1 object-contain"
              height="1080"
              layout="responsive"
              src={getDirectusFile(imageSquare)}
              width="1080"
            />
          </div>
          {/* </MotionDiv> */}
          {/* <MotionDiv
            {...fadeInUpEaseProps}
            transition={{
              ...fadeInUpEaseProps.transition,
              delay: 0.1,
            }}
          > */}
          <div className="h-full w-full overflow-hidden rounded-xl lg:rounded-[20px] md:w-[97%]">
            <Image
              //   blurOnLoad
              alt="Long Deals Banner"
              className="object-cover"
              height="1248"
              layout="responsive"
              src={getDirectusFile(imageLong)}
              width="3280"
            />
          </div>
          {/* </MotionDiv> */}
        </div>
      </div>
    </section>
  );
}

async function FeaturedDealsSection() {
  const shopSettings = await getShopSettings();
  const deals = await getProductDeals();
  const featured_deals = (
    (deals?.[1]?.product_deals as { handle: string; deal_price?: number }[]) || []
  ).map((deal) => ({
    handle: deal.handle,
    deal_price: deal.deal_price,
  }));

  return (
    <section className="my-12 lg:my-16">
      <MotionDiv className="container" {...fadeInUpEaseProps}>
        <div className="flex flex-col gap-4">
          <FeaturedDeals featured_deals={featured_deals} />
        </div>
      </MotionDiv>
    </section>
  );
}
