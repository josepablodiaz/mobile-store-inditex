import { Link } from 'react-router-dom';
import './ProductCard.css';

/**
 * @param {object} props
 * @param {object} props.product
 */
const ProductCard = ({ product }) => {
  const { id, brand, model, price, imgUrl } = product;
  const displayPrice = price ? `${price}€` : 'Price not available';

  return (
    <Link
      to={`/product/${id}`}
      className="product-card"
      data-testid="product-card"
    >
      <div className="product-card-image-container">
        <img
          src={imgUrl}
          alt={`${brand} ${model}`}
          className="product-card-image"
          loading="lazy"
        />
      </div>

      <div className="product-card-content">
        <span className="product-card-brand">{brand}</span>

        <h3 className="product-card-model">{model}</h3>

        <span className={`product-card-price ${!price ? 'no-price' : ''}`}>
          {displayPrice}
        </span>
      </div>
    </Link>
  );
};

export default ProductCard;
