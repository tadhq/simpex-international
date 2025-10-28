import { ProductVariant } from '@medusajs/medusa';

type LineItemOptionsProps = { variant: ProductVariant };

const LineItemOptions = ({ variant }: LineItemOptionsProps) => {
  // TODO unhide
  return (
    <p className="inline-blocks text-base-700 w-full overflow-hidden text-ellipsis hidden">
      Variant: {variant.title}
    </p>
  );
};

export default LineItemOptions;
