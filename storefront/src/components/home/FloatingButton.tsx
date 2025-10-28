import { MotionDiv } from '@/lib/motion';
import { Icon } from '../iconify';

export default function FloatingButton() {
  return (
    <MotionDiv>
      <div className="fixed right-4 bottom-4 z-40">
        <span className="relative flex">
          <span className="absolute inline-flex h-full w-full animate-subtle-ping rounded-full bg-[#26d367]/50"></span>
          <a
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#26d367] text-white shadow"
            href="https://wa.me/5977699992"
            rel="noreferrer"
            target="_blank"
          >
            <Icon icon="fa-brands:whatsapp" width="24" />
          </a>
        </span>
        {/* <ScrollToTopButton /> */}
      </div>
    </MotionDiv>
  );
}

// function ScrollToTopButton() {
//   return (
//     <IconButton
//       className="group mt-3 !rounded-full shadow"
//       color="secondary"
//       type="button"
//       onClick={scrollToTop}
//     >
//       <ChevronsUp className="transition-transform group-hover:-translate-y-[0.125rem]" />
//     </IconButton>
//   );
// }
