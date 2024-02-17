import IndexView from "./view.js"
import db from '../fixtures/db.js'
var areaList = []

export default class IndexController {
    constructor() {
        this.view = new IndexView()
        this.db = db
        this.areaList = areaList
    }

    onCreate () {
        this.view.initView(this)
        this.view.createCableCards()
        this.resetDuct()
        this.calculateDuctArea()
        this.ductMonitor()
        this.view.quantityButtons(this)
        this.view.addButtonClicked(this)
    }

    calculateDuctArea () {
        db.ducting.map(duct => {
            areaList.push({
                id: duct.id,
                name: duct.name,
                area: duct.diameter*duct.diameter*3.14159265358979*0.25,
                usable: duct.diameter*duct.diameter*3.14159265358979*0.25*0.4
            })
        })
    }

    onQuantityInputChange (id, value) {
        if (value === '') {
            this.view.updateCardQuantityInput(id, 1)
        } else if (value < 1) {
            this.view.updateCardQuantityInput(id, 1)
        } else if (value > 99) {
            this.view.updateCardQuantityInput(id, 99)
        } else if (Math.floor(parseInt(value))) {
            this.view.updateCardQuantityInput(id, Math.floor(value))
        }
    }

    onAddButtonClick (vias, diam, quantity) {
        const resp = db.cable.filter(e => e.id === diam )[0]
        const area = this.onCalculateArea(vias, resp, quantity)
        this.addCableToDuct(vias, diam, quantity, area)
        this.view.resetCard(vias)
    }

    onCalculateArea (vias, resp, quantity) {
        const diam = resp.formation[vias]
        const area = diam*diam*3.14159265358979*0.25
        const totalArea = area*quantity
        return totalArea
    }

    calculateTotalCableArea (duct) {
        let totalArea = 0
        duct.forEach( cable => {
            totalArea += cable.area
        } )
        return totalArea
    }

    calculateMinimumDuct (duct) {
        let totalCableArea = this.calculateTotalCableArea(duct)
        let viableDucts = [ ]

        if ( this.areaList[areaList.length - 1].usable < totalCableArea ) {
            
            return `> 4"`

        } else {

            this.areaList.forEach( duct => {
                if ( duct.usable > totalCableArea ) {
                    viableDucts.push({id: duct.id, name: duct.name})
                }
            } )
            return viableDucts[0].name

        }
    }

    calculatePercentage (duct) {
        let totalCableArea = this.calculateTotalCableArea(duct)
        let viableDucts = [ ]

        if ( this.areaList[areaList.length - 1].usable < totalCableArea ) {
            
            return ""

        } else {

            this.areaList.forEach( duct => {
                if ( duct.usable > totalCableArea ) {
                    viableDucts.push({id: duct.id, name: duct.name, area: duct.area})
                }
            } )
            let percentage = `${((totalCableArea/viableDucts[0].area)*100).toFixed(2)}%`
            return percentage
        }
    }

    addCableToDuct (vias, diam, quantity, area) {
        if ( isNaN(quantity) ) {
            throw new Error('quantity is not an integer')
        }
        let duct = this.getCableIds() || [ ]
        duct.push({ vias, diam, quantity, area })
        try {
            const ductJson = JSON.stringify(duct)
            const ductBtoa = btoa(ductJson)
            localStorage.setItem('duct', ductBtoa)
        } catch (error) {
            localStorage.removeItem('duct')
            throw new Error('not possible to parse duct')
        }
        this.ductMonitor()
    }

    removeCableFromDuct(string) {
        const id = parseInt(string)
        let duct = this.getCableIds() || [ ]
        duct.splice(id, 1)
        try {
            const ductJson = JSON.stringify(duct)
            const ductBtoa = btoa(ductJson)
            localStorage.setItem('duct', ductBtoa)
        } catch (error) {
            localStorage.removeItem('duct')
            throw new Error('not possible to parse duct')
        }
        this.ductMonitor()
    }

    getCableIds () {
        try {
            const ductString = localStorage.getItem('duct')
            const ductJson = atob(ductString)
            return JSON.parse(ductJson)
        } catch {
            return
        }
    }

    ductMonitor () {
        let duct = this.getCableIds() || [ ]
        let minimum = this.calculateMinimumDuct(duct)
        let percentage = this.calculatePercentage(duct)
        this.view.updateDuctItems(duct)
        this.view.updateDuctTotal(duct, minimum, percentage)
    }

    resetDuct () {
        localStorage.removeItem('duct')
    }
}