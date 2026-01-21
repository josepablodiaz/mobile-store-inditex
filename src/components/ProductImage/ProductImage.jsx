import './ProductImage.css';

/**
 * @param {object} props
 * @param {string} props.src
 * @param {string} props.alt
 */
const ProductImage = ({ src, alt }) => {
  return (
    <div className="product-image">
      <div className="product-image-container">
        <img
          src={src}
          alt={alt}
          className="product-image-img"
          data-testid="product-image"
        />
        <div className="product-image-glow" />
      </div>
    </div>
  );
};

export default ProductImage;
