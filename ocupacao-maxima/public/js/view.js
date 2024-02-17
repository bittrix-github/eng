export default class IndexView {

    initView(events) {
        this.events = events

        const cableCardContainer = $('.CableCardContainer')
        const cableItems = $('.CableItems')
        const minimumDuct = $('.MinimumDuct')
        const percentage = $('.Percentage')

        window.views = {

            cableCardContainer,
            cableItems,
            minimumDuct,
            percentage
            
        }
    }

    createCableCards () {
        for ( let i = 1; i < 5; i++ ) {

            window.views.cableCardContainer.append(`
            
            <li class="CableCard" id="_Card__via${i}">
                <h4>${i} via</h4>
                
                <label for="_Option__via${i}">Seção transversal:</label>
                <select id="_Option__via${i}">
                    <option value="1">1,5 mm²</option>
                    <option value="2">2,5 mm²</option>
                    <option value="4">4 mm²</option>
                    <option value="6">6 mm²</option>
                    <option value="10">10 mm²</option>
                    <option value="16">16 mm²</option>
                    <option value="25">25 mm²</option>
                    <option value="35">35 mm²</option>
                    <option value="50">50 mm²</option>
                    <option value="70">70 mm²</option>
                    <option value="90">90 mm²</option>
                    <option value="120">120 mm²</option>
                    <option value="150">150 mm²</option>
                    <option value="185">185 mm²</option>
                    <option value="240">240 mm²</option>
                </select>

                <label for="quantity">Quantidade:</label>
                <input class="CardQuantity" type="number" min="1" max="99" value="1" id="_Quantity__via${i}">

                <button class="AddToDuctButton" id="_AddToDuct__via${i}">Adicionar</button>
            </li>
            
            `)

        }
    }

    quantityButtons() {
        $('.CardQuantity').change( event => {
            const cableId = event.currentTarget.id.split('__')[1]
            const quantity = $(`#_Quantity__${cableId}`).val()
            this.events.onQuantityInputChange(cableId, quantity)
        } )
    }

    updateCardQuantityInput(id, newValue) {
        $(`#_Quantity__${id}`).val(newValue)
    }

    addButtonClicked() {
        $('.AddToDuctButton').click( event => {
            const buttonId = event.currentTarget.id.split('__')[1]
            const type = parseInt($(`#_Option__${buttonId}`).val())
            const quantity = parseInt($(`#_Quantity__${buttonId}`).val())
            this.events.onAddButtonClick(buttonId, type, quantity)
        } )
    }

    resetCard(id) {
        $(`#_Option__${id}`).val(1)
        $(`#_Quantity__${id}`).val(1)
    }

    updateDuctItems(duct) {
        let i = 0
        window.views.cableItems.empty()

        if ( duct.length < 1 ) {
            window.views.cableItems.append(`<div class="CableItem EmptyDuct"><p>Eletroduto vazio</p></div>`)
            return
        }

        let iconList = ["&#10248", "&#10250", "&#10251", "&#10267" ]
        duct.forEach( cable => {

            if ( cable.diam === 1 || cable.diam === 2 ) {
                cable.diam = `${cable.diam},5`
            }

            window.views.cableItems.append(`
        
                <div class="CableItem"><span>#${i+1}: </span><div class="CableSymbol">${iconList[cable.vias.split('a')[1]-1]}</div><p>${cable.vias.split('a')[1]}x${cable.diam} mm² (x${cable.quantity})</p> <ion-icon id="_DeleteButton__${i}" name="trash-outline"></ion-icon></div>
    
            `)

            i += 1
    
        })

        window.views.cableItems.append(`
            <div class="ClearDuct"><button>Limpar eletroduto</button></div>
        `)

        this.createClearDuctButton()
        this.createRemoveFromDuctButtons()
    }

    createClearDuctButton() {
        $('.ClearDuct').click( event => {
            this.events.resetDuct()
            this.events.ductMonitor()
        })
    }

    createRemoveFromDuctButtons() {
        $('ion-icon').click( event => {
            const buttonId = event.currentTarget.id.split('__')[1]
            this.events.removeCableFromDuct(buttonId)
        } )
    }

    updateDuctTotal(duct, minimum, percentage) {
        window.views.minimumDuct.empty()
        window.views.percentage.empty()
        if (duct.length < 1) {
            window.views.minimumDuct.append(`<h5>Vazio</h5>`)
        }

        else if ( percentage ) {
            window.views.minimumDuct.append(`
                <h5>${minimum}</h5>
            `)
            window.views.percentage.append(`
                <h6>Ocupação: ${percentage}</h6>
            `)
        }

        else {
            window.views.minimumDuct.append(`
            <h5>${minimum}</h5>
        `)
        }
    }
    

}