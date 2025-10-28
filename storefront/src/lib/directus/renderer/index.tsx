import ContentSection from '@/components/about/ContentSection';
import TitleDescriptionImageSection from '@/components/about/TitleDescriptionImageSection';
import BigHeroSection from '@/components/careers/BigHeroSection';
import InlineImageWithContentSection from '@/components/careers/InlineImageWithContentSection';
import VacanciesSection from '@/components/careers/vacancies/VacanciesSection';
import ContactInfoFormSection from '@/components/contact/ContactInfoFormSection';
import PageHeaderSection from '@/components/contact/PageHeaderSection';
import ContentEditorSection from '@/components/content-editor/ContentEditorSection';
import ContentSidebarSection from '@/components/content-sidebar/ContentSidebarSection';
import DealsSection from '@/components/deals/DealsSection';
import FaqsAccordionsSection from '@/components/help/FaqsAccordionsSection';
import {
  BannersWideSection,
  BrandsCarouselSection,
  CategoriesCarouselSection,
  FeaturedProduct,
  NewsletterCtaSection,
  ProductsTabs2Section,
  ProductsTabsSection,
  VideoHeroSection,
} from '@/components/home';
import CardImageSection from '@/components/home/CardImageSection';
import CategoriesCardsSection from '@/components/home/CategoriesCardsSection';
import DoublePromoBannerSection from '@/components/home/DoublePromoBannerSection';
import CarouselHeroSection from '@/components/home/HeroCarouselSection';
import NewProductsSection from '@/components/home/NewProductsSection';
import NewsletterSection from '@/components/home/NewsletterSection';
import ProductsDoubleRowsSection from '@/components/home/ProductsDoubleRowsSection';
import ProductsSingleRowSection from '@/components/home/ProductsSingleRowSection';
import { DirectusSchema } from '@/lib/directus/types';
import { getDirectusFile } from '@/lib/directus/utils';
import { Suspense } from 'react';

interface Props {
  page: DirectusSchema['pages'];
}

export default function Renderer({ page }: Props) {
  const sections = (
    (page?.translations as any)?.[0]?.sections as DirectusSchema['pages_translations_sections'][]
  )?.map((section) => {
    let item;
    switch (section.collection as keyof DirectusSchema) {
      case 'section_banners_wide':
        item = section.item as DirectusSchema['section_banners_wide'];
        return <BannersWideSection key={section.id} items={item.images as any} />;
      case 'section_brands_carousel':
        item = section.item as DirectusSchema['section_brands_carousel'];
        return (
          <BrandsCarouselSection
            key={section.id}
            heading={item.heading as string}
            images={item.images as any}
          />
        );
      case 'section_categories_carousel':
        item = section.item as DirectusSchema['section_categories_carousel'];
        return (
          <CategoriesCarouselSection
            key={section.id}
            heading={item.heading as string}
            style={item.style as string}
          />
        );
      case 'section_products_tabs':
        item = section.item as DirectusSchema['section_products_tabs'];
        return (
          <ProductsTabsSection
            key={section.id}
            categories={item.categories as any}
            heading={item.heading as string}
            id={item.id as number}
          />
        );
      case 'section_newsletter_cta':
        item = section.item as DirectusSchema['section_newsletter_cta'];
        return <NewsletterCtaSection {...(item as any)} key={section.id} />;
      case 'section_newsletter':
        item = section.item as DirectusSchema['section_newsletter'];
        return <NewsletterSection {...(item as any)} key={section.id} />;
      case 'section_products_tabs_2' as string:
        item = section.item as DirectusSchema['section_products_tabs2'];
        return (
          <ProductsTabs2Section
            key={section.id}
            categories={item.categories as any}
            heading={item.heading as string}
            id={item.id as number}
            image={item.image as any}
          />
        );
      case 'section_video_hero':
        item = section.item as DirectusSchema['section_video_hero'];
        return (
          <VideoHeroSection
            key={section.id}
            slot1={
              // TODO add skeleton
              <Suspense fallback={null}>
                <FeaturedProduct handle={item.featured_product_1 as string} />
              </Suspense>
            }
            slot2={
              // TODO add skeleton
              <Suspense fallback={null}>
                <FeaturedProduct handle={item.featured_product_2 as string} />
              </Suspense>
            }
            videoOptions={item.video_options as any}
            videoUrl={item.video_url as string}
          />
        );
      case 'section_page_header':
        item = section.item as DirectusSchema['section_page_header'];
        return <PageHeaderSection {...(item as any)} key={section.id} />;
      case 'section_contact_info_form':
        item = section.item as DirectusSchema['section_contact_info_form'];
        return (
          <ContactInfoFormSection
            key={section.id}
            contactInfo={item.contact_info as any}
            image={getDirectusFile(item.image)}
            title={item.title}
          />
        );
      case 'section_content_sidebar':
        item = section.item as DirectusSchema['section_content_sidebar'];
        return (
          <ContentSidebarSection
            key={section.id}
            content={item.content as string}
            links={item.sidebar_links as Record<string, any>[]}
          />
        );
      case 'section_content_editor':
        item = section.item as DirectusSchema['section_content_editor'];
        return <ContentEditorSection key={section.id} content={item.content} />;
      case 'section_products_double_rows':
        item = section.item as DirectusSchema['section_products_double_rows'];
        return <ProductsDoubleRowsSection {...(item as any)} key={section.id} />;
      case 'section_inline_image_with_content':
        item = section.item as DirectusSchema['section_inline_image_with_content'];
        return <InlineImageWithContentSection {...(item as any)} key={item.id} />;
      case 'section_vacancies':
        item = section.item as DirectusSchema['section_vacancies'];
        return <VacanciesSection {...(item as any)} key={item.id} />;
      case 'section_big_hero':
        item = section.item as DirectusSchema['section_big_hero'];
        return <BigHeroSection {...(item as any)} key={item.id} />;
      case 'section_faqs_accordions':
        item = section.item as DirectusSchema['section_faqs_accordions'];
        return <FaqsAccordionsSection {...(item as any)} key={item.id} />;
      case 'section_carousel_hero':
        item = section.item as DirectusSchema['section_carousel_hero'];
        return <CarouselHeroSection key={section.id} {...item} />;
      case 'section_b2b_home_categories':
        item = section.item as DirectusSchema['section_b2b_home_categories'];
        return <CategoriesCardsSection key={section.id} heading={item.heading as string} />;
      case 'section_double_promo_banner':
        item = section.item as DirectusSchema['section_double_promo_banner'];
        return <DoublePromoBannerSection {...(item as any)} key={section.id} />;
      case 'section_card_images':
        item = section.item as DirectusSchema['section_card_images'];
        return <CardImageSection {...(item as any)} key={section.id} />;
      case 'section_new_products':
        item = section.item as DirectusSchema['section_new_products'];
        return <NewProductsSection {...(item as any)} key={section.id} />;
      case 'section_products_single_row':
        item = section.item as DirectusSchema['section_products_single_row'];
        return <ProductsSingleRowSection {...(item as any)} key={section.id} />;
      case 'section_title_description_image':
        item = section.item as DirectusSchema['section_title_description_image'];
        return <TitleDescriptionImageSection {...(item as any)} key={section.id} />;
      case 'section_content':
        item = section.item as DirectusSchema['section_content'];
        return <ContentSection {...(item as any)} key={section.id} />;
      case 'section_deals':
        item = section.item as DirectusSchema['section_deals'];
        return <DealsSection {...(item as any)} key={section.id} />;
    }
  });

  return sections;
}
