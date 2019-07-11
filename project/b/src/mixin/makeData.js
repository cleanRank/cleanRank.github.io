export default {
  methods: {
    makeData (item) {
      let productDataForBuryPoint = {}
      let productSkuIdStr = ''
      let productSkuNameStr = ''
      let productPriceStr = ''
      let productTypeStr = ''
      let productSpuCategoryLv1ID = ''
      let productSpuCategoryLv2ID = ''
      let productCountStr = ''
      if (Array.isArray(item)) {
        item.map((val, index) => {
          productSkuIdStr += (val.qualityProduct.productNo || '') + ","
          productSkuNameStr += (val.qualityProduct.productName || '')+ ","
          productPriceStr += (val.qualityProduct.price || '') + ","
          productTypeStr += (val.qualityProduct.productType || '') + ","
          productSpuCategoryLv1ID += (val.qualityProduct.upCategoryType || '') + ","
          productSpuCategoryLv2ID += (val.qualityProduct.categoryType || '') + ","
          productCountStr += (val.buycount || val.quantity || 1) + ","
        })
        productSkuIdStr = productSkuIdStr.substring(0, productSkuIdStr.length-1)
        productSkuNameStr = productSkuNameStr.substring(0, productSkuNameStr.length-1)
        productPriceStr = productPriceStr.substring(0, productPriceStr.length-1)
        productTypeStr = productTypeStr.substring(0, productTypeStr.length-1)
        productSpuCategoryLv1ID = productSpuCategoryLv1ID.substring(0, productSpuCategoryLv1ID.length-1)
        productSpuCategoryLv2ID = productSpuCategoryLv2ID.substring(0, productSpuCategoryLv2ID.length-1)
        productCountStr = productCountStr.substring(0, productCountStr.length-1)
        productDataForBuryPoint.skuId = productSkuIdStr
        productDataForBuryPoint.skuName = productSkuNameStr
        productDataForBuryPoint.price = productPriceStr
        productDataForBuryPoint.productType = productTypeStr
        productDataForBuryPoint.spuCategoryLv1ID = productSpuCategoryLv1ID
        productDataForBuryPoint.spuCategoryLv2ID = productSpuCategoryLv2ID
        productDataForBuryPoint.producrNumber = productCountStr
        return productDataForBuryPoint
      } else if (item.productNo != undefined) {
        const {productName, price, productNo, productType, upCategoryType, categoryType, jdPrice} = item
        if (jdPrice) {
          productDataForBuryPoint.price = jdPrice
        } else {
          productDataForBuryPoint.price = price || ''
        }
        productDataForBuryPoint.skuId = productNo || ''
        productDataForBuryPoint.skuName = productName || ''
        productDataForBuryPoint.productType = productType || '实物商品'
        productDataForBuryPoint.spuCategoryLv1ID = upCategoryType || ''
        productDataForBuryPoint.spuCategoryLv2ID = categoryType || ''
        productDataForBuryPoint.producrNumber = 1
        return productDataForBuryPoint
      } else {
        if (item.qualityProduct) {
          productSkuIdStr += (item.qualityProduct.productNo || '') + ","
          productSkuNameStr += (item.qualityProduct.productName || '') + ","
          productPriceStr += (item.qualityProduct.jdPrice || '') + ","
          productTypeStr += item.qualityProduct.productType + ","
          productSpuCategoryLv1ID += (item.qualityProduct.upCategoryType || '') + ","
          productSpuCategoryLv2ID += (item.qualityProduct.categoryType || '') + ","
          productCountStr += (item.buycount || item.quantity || 1) + ","
        } else {
          for (let key in item) {
            productSkuIdStr += (item[key].qualityProduct.productNo || '') + ","
            productSkuNameStr += (item[key].qualityProduct.productName || '') + ","
            productPriceStr += (item[key].qualityProduct.jdPrice || '') + ","
            productTypeStr += (item[key].qualityProduct.productType || '') + ","
            productSpuCategoryLv1ID += (item[key].qualityProduct.upCategoryType || '') + ","
            productSpuCategoryLv2ID += (item[key].qualityProduct.categoryType || '') + ","
            productCountStr += (item[key].buycount || item[key].quantity || 1) + ","
          }
        }
        productSkuIdStr = productSkuIdStr.substring(0, productSkuIdStr.length-1)
        productSkuNameStr = productSkuNameStr.substring(0, productSkuNameStr.length-1)
        productPriceStr = productPriceStr.substring(0, productPriceStr.length-1)
        productTypeStr = productTypeStr.substring(0, productTypeStr.length-1)
        productSpuCategoryLv1ID = productSpuCategoryLv1ID.substring(0, productSpuCategoryLv1ID.length-1)
        productSpuCategoryLv2ID = productSpuCategoryLv2ID.substring(0, productSpuCategoryLv2ID.length-1)
        productCountStr = productCountStr.substring(0, productCountStr.length-1)
        productDataForBuryPoint.skuId = productSkuIdStr
        productDataForBuryPoint.skuName = productSkuNameStr
        productDataForBuryPoint.price = productPriceStr
        productDataForBuryPoint.productType = productTypeStr
        productDataForBuryPoint.spuCategoryLv1ID = productSpuCategoryLv1ID
        productDataForBuryPoint.spuCategoryLv2ID = productSpuCategoryLv2ID
        productDataForBuryPoint.producrNumber = productCountStr
        return productDataForBuryPoint
      }
    }
  }
}

