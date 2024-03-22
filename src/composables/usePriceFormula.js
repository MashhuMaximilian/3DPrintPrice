// usePriceFormula.js

export function usePriceFormula() {
    // Constants
    const packagingCost = 1;
    const machineCost = 2;
    const markup = 2;
    const designAndReviews = 25;
    const pricePerLiterOfResin = 120;
    const supportsMarginError = 0.15;
  
    // Function to calculate price
    function calculatePrice(scaledVolumeInMl, quantity) {
      const materialCost = (pricePerLiterOfResin * scaledVolumeInMl * (1 + supportsMarginError)) / 1000;
      const sellPrice = ((packagingCost + materialCost + machineCost) * markup + designAndReviews) * quantity;
      console.log(`Sell Price: ${sellPrice}`);
      return sellPrice;
    }
  
    return {
      calculatePrice,
    };
  }
  
