import React, { useState, useEffect } from 'react';
import './index.css';
import ChartDisplay from './ChartDisplay';
import BarGraph from './BarGraph';
const ImageTable = ({ products, currentImage }) => {
    const [outArray, setOutArray] = useState([]);
    const [emptyFilter, setEmptyFilter] = useState(false)
    const [newOutArray, setNewOutArray] = useState(outArray);
    const [highlight, setHighlight] = useState(false)
    const images = require.context('../../server/uploads/', true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "ascending",
    });

    const [upcFilter, setUpcFilter] = useState('');
    const [productNameFilter, setProductNameFilter] = useState('');
    const [brandNameFilter, setBrandNameFilter] = useState('');
    const [shelfLevelFilter, setShelfLevelFilter] = useState('');

    useEffect(() => {
        const newOutArray1 = outArray
            .filter(product => {
                return (
                    product.upc.includes(upcFilter) &&
                    product.productName.includes(productNameFilter) &&
                    product.brandName.includes(brandNameFilter) &&
                    product.shelfLevel.includes(shelfLevelFilter)
                );
            })
        setNewOutArray(newOutArray1)
      

        if((productNameFilter.length === 0) && (brandNameFilter.length === 0) && (upcFilter.length === 0) && (shelfLevelFilter.length === 0)) {
            setEmptyFilter(true)
         } else {
            setEmptyFilter(false)
         }

         setHighlight(!highlight)
    }, [upcFilter, productNameFilter, brandNameFilter, shelfLevelFilter])

    useEffect(() => {
        const originalImage = new Image();
        originalImage.src = images(`./${currentImage}.jpg`);
        const scaledWidth = window.innerWidth * 0.335; // 45% of viewport width
        const scaleFactor = scaledWidth / originalImage.naturalWidth;

        if(emptyFilter) {
            for (const item of products) {
                const { imageUUID, x, y, width, height, productName } = item;
                const imageElement = document.getElementById(imageUUID);
    
                if (imageElement) {
                    drawBoundingBox(imageUUID, x, y, width, height, productName, selectedProduct, scaleFactor);
                }
            }
        } else {
            const filteredProducts = products.filter(product => {
                return newOutArray.some(newProduct => newProduct.upc === product.upc);
            });
            const nonFilteredProducts = products.filter(product => {
                return newOutArray.some(newProduct => newProduct.upc !== product.upc);
            });
            for (const item of nonFilteredProducts) {
                const { imageUUID, x, y, width, height, productName } = item;
                const imageElement = document.getElementById(imageUUID);
    
                if (imageElement) {
                    drawBoundingBox(imageUUID, x, y, width, height, productName, selectedProduct, scaleFactor);
                }
            }
    
            for (const item of filteredProducts) {
                const { imageUUID, x, y, width, height, productName } = item;
                const imageElement = document.getElementById(imageUUID);
    
                if (imageElement) {
                    drawBoundingBox(imageUUID, x, y, width, height, productName, selectedProduct, scaleFactor, true);
                }
            }
    
        }
      
    }, [highlight])

    useEffect(() => {
        setUpcFilter('');
        setProductNameFilter('');
        setBrandNameFilter('');
        setShelfLevelFilter('');
    }, [outArray]);

    useEffect(() => {
        const originalImage = new Image();
        originalImage.src = images(`./${currentImage}.jpg`);
        const scaledWidth = window.innerWidth * 0.335; // 45% of viewport width
        const scaleFactor = scaledWidth / originalImage.naturalWidth;

        for (const item of products) {
            const { imageUUID, x, y, width, height, productName } = item;
            const imageElement = document.getElementById(imageUUID);

            if (imageElement) {
                drawBoundingBox(imageUUID, x, y, width, height, productName, selectedProduct, scaleFactor, false);
            }
        }

    }, [products, currentImage, selectedProduct]);

    const sortTable = (key) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    };

    function drawBoundingBox(imageUUID, x, y, width, height, productName, selectedProduct, scaleFactor, isHighlighted) {
        const imageElement = document.getElementById(imageUUID);
        const boundingBox = document.createElement('div');
        boundingBox.className = 'bounding-box';
        boundingBox.style.left = `calc(33.5% + ${x * scaleFactor - width * scaleFactor / 2}px)`;    
        boundingBox.style.top = y * scaleFactor + 'px';    
        boundingBox.style.width = width * scaleFactor + 'px';    
        boundingBox.style.height = height * scaleFactor + 'px'; 
        boundingBox.title = productName; 
        boundingBox.setAttribute('data-product', productName);

        if (productName === selectedProduct) {
            boundingBox.classList.add('highlighted');
        } else {

            if (isHighlighted !== undefined && isHighlighted === true) {
                boundingBox.classList.add('highlighted');
            } else {
                boundingBox.classList.add('non-highlighted');
            }
        }
        imageElement.parentElement.appendChild(boundingBox);
    }


    useEffect(() => {

        const outputArray = []

        const upcCounts = {};

        for (const item of products) {
            const upc = item.upc;
            if (!upcCounts[upc]) {
                upcCounts[upc] = 1;
            } else {
                upcCounts[upc]++;
            }
        }

        const processedUpcs = {};

        for (const item of products) {
            const { upc, shelfLevel, productName, brandName } = item;
            if (!processedUpcs[upc]) {
                const facings = upcCounts[upc];
                outputArray.push({
                    upc,
                    shelfLevel,
                    productName,
                    brandName,
                    facings
                });
                processedUpcs[upc] = true;
            }
        }
        setOutArray(outputArray)
        setNewOutArray(outputArray)
    }, [products])

    useEffect(() => {
        console.log("selected" + selectedProduct)
        for (const item of products) {
            const { imageUUID, x, y, width, height, productName } = item;
            const imageElement = document.getElementById(imageUUID);

            if (imageElement) {
                drawBoundingBox(imageUUID, x, y, width, height, productName, selectedProduct);
            }
        }
    }, [selectedProduct])

    const handleProductClick = (productName) => {
        setSelectedProduct(productName);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
                <img
                    id={currentImage}
                    src={images(`./${currentImage}.jpg`)}
                    alt={currentImage}
                    style={{ display: 'block', maxWidth: "35%", marginLeft: 'auto', marginRight: 'auto' }}
                />
            </div>

            <div className='table-container'>
                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #ccc', cursor: 'pointer' }} >
                                <div onClick={() => sortTable('upc')}>
                                    UPC
                                    {sortConfig.key === 'upc' ? (
                                        sortConfig.direction === 'ascending' ? (
                                            <span>⬇️</span>
                                        ) : (
                                            <span>⬆️</span>
                                        )
                                    ) : (
                                        <span>↕️</span>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    placeholder="Filter UPC"
                                    value={upcFilter}
                                    onChange={e => setUpcFilter(e.target.value)}
                                />
                            </th>

                            <th style={{ border: '1px solid #ccc', cursor: 'pointer' }} onClick={() => sortTable('facings')}>
                                Facings
                                {sortConfig.key === 'facings' ? (
                                    sortConfig.direction === 'ascending' ? (
                                        <span>⬇️</span>
                                    ) : (
                                        <span>⬆️</span>
                                    )
                                ) : (
                                    <span>↕️</span>
                                )}
                            </th>
                            <th style={{ border: '1px solid #ccc', cursor: 'pointer' }}>
                                <div onClick={() => sortTable('shelfLevel')}>
                                    Shelf Level
                                    {sortConfig.key === 'shelfLevel' ? (
                                        sortConfig.direction === 'ascending' ? (
                                            <span>⬇️</span>
                                        ) : (
                                            <span>⬆️</span>
                                        )
                                    ) : (
                                        <span>↕️</span>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    placeholder="Filter Shelf Level"
                                    value={shelfLevelFilter}
                                    onChange={e => setShelfLevelFilter(e.target.value)}
                                />
                            </th>
                            <th style={{ border: '1px solid #ccc', cursor: 'pointer' }} >
                                <div onClick={() => sortTable('productName')}>
                                    Product Name
                                    {sortConfig.key === 'productName' ? (
                                        sortConfig.direction === 'ascending' ? (
                                            <span>⬇️</span>
                                        ) : (
                                            <span>⬆️</span>
                                        )
                                    ) : (
                                        <span>↕️</span>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    placeholder="Filter Product Name"
                                    value={productNameFilter}
                                    onChange={e => setProductNameFilter(e.target.value)}
                                />
                            </th>
                            <th style={{ border: '1px solid #ccc', cursor: 'pointer' }} >
                                <div onClick={() => sortTable('brandName')}>
                                    Brand Name

                                    {sortConfig.key === 'brandName' ? (
                                        sortConfig.direction === 'ascending' ? (
                                            <span>⬇️</span>
                                        ) : (
                                            <span>⬆️</span>
                                        )
                                    ) : (
                                        <span>↕️</span>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    placeholder="Filter Brand Name"
                                    value={brandNameFilter}
                                    onChange={e => setBrandNameFilter(e.target.value)}
                                />
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            newOutArray
                                .sort((a, b) => {
                                    if (sortConfig.key) {
                                        const direction = sortConfig.direction === "ascending" ? 1 : -1;
                                        if (sortConfig.key === 'facings' || sortConfig.key === 'upc') {
                                            return (a[sortConfig.key] - b[sortConfig.key]) * direction;
                                        } else {
                                            return a[sortConfig.key].localeCompare(b[sortConfig.key]) * direction;
                                        }
                                    }
                                    return 0;
                                })
                                .map((product, index) => (
                                    <tr key={index} onClick={() => handleProductClick(product.productName)}>
                                        <td style={{ border: '1px solid #ccc' }}>{product.upc}</td>
                                        <td style={{ border: '1px solid #ccc' }}>{product.facings}</td>
                                        <td style={{ border: '1px solid #ccc' }}>{product.shelfLevel}</td>
                                        <td style={{ border: '1px solid #ccc' }}>{product.productName}</td>
                                        <td style={{ border: '1px solid #ccc' }}>{product.brandName}</td>
                                    </tr>
                                ))}
                    </tbody>
                </table>
            </div>
            <div className='charts-container' style={{ marginTop:'20px',display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
    <div>
        <ChartDisplay products={products} />
    </div>
    <div>
        <BarGraph products={products} />
    </div>
</div>
</div>
    );

};

export default ImageTable;
