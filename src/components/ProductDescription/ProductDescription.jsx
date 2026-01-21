import './ProductDescription.css';

/**
 * @param {object} props
 * @param {object} props.product
 */
const ProductDescription = ({ product }) => {
  const {
    brand,
    model,
    price,
    cpu,
    ram,
    os,
    displayResolution,
    displaySize,
    battery,
    primaryCamera,
    secondaryCmera,
    dimentions,
    weight,
  } = product;

  const formatCamera = (camera) => {
    if (Array.isArray(camera)) {
      return camera.join(', ');
    }
    return camera || 'N/A';
  };

  // Lista de características
  const specs = [
    { label: 'Brand', value: brand },
    { label: 'Model', value: model },
    { label: 'Price', value: price ? `${price}€` : 'Not available' },
    { label: 'CPU', value: cpu || 'N/A' },
    { label: 'RAM', value: ram || 'N/A' },
    { label: 'Operating System', value: os || 'N/A' },
    { label: 'Screen Resolution', value: displayResolution || 'N/A' },
    { label: 'Screen Size', value: displaySize || 'N/A' },
    { label: 'Battery', value: battery || 'N/A' },
    { label: 'Primary Camera', value: formatCamera(primaryCamera) },
    { label: 'Secondary Camera', value: formatCamera(secondaryCmera) },
    { label: 'Dimensions', value: dimentions || 'N/A' },
    { label: 'Weight', value: weight ? `${weight}g` : 'N/A' },
  ];

  return (
    <div className="product-description" data-testid="product-description">
      <h1 className="product-description-title">
        <span className="product-description-brand">{brand}</span>
        <span className="product-description-model">{model}</span>
      </h1>

      {price && <div className="product-description-price">{price}€</div>}

      <div className="product-description-specs">
        <h2 className="specs-title">Specifications</h2>
        <dl className="specs-list">
          {specs.map(({ label, value }) => (
            <div key={label} className="specs-item">
              <dt className="specs-label">{label}</dt>
              <dd className="specs-value">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};

export default ProductDescription;
