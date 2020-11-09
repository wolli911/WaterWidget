// WaterWidget für alle bayerischen Flüsse
//
//Daten für Wassertemperatur, Wasserqualität und Wasserhöhe werden vom NID und HND ausgelesen.
//
// Copyright (C) 2020 by wolli911 <wolli@wolli.info>
//
// Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
// INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER
// IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE
// OF THIS SOFTWARE.

//Wassertemperatur ermitteln vom NID
const data = await fetchData()
var zahl = data.indexOf("Letzte Messwerte vom")
var lastmeasure01 = data.slice(zahl, zahl + 45)
var lastmeasure = lastmeasure01.slice(29,45)
var zahl2 = data.indexOf("Max. Tages-Wassertemperatur des Vortages")
var hist01 = data.slice(zahl2, zahl2 + 60)
var hist = hist01.slice(55,59)
var zahl3 = data.indexOf("OGewVO: <strong>")
var orient01 = data.slice(zahl3, zahl3 + 41)
var orient = orient01.slice(16,41)
if (orient == "Guter Zustand eingehalten") {
 orient = "👍"
} else {
 orient = "👎"
}
var zahl4 = data.indexOf("<!-- ----------- TABELLE ------------------- -->")
var temp01 = data.slice(zahl4, zahl4 + 400)
var zahl5 = temp01.indexOf(lastmeasure)
var temp02 = temp01.slice(zahl5, zahl5 + 50)
var temp = temp02.slice(41,45)

//Wasserstand ermitteln vom HND
const datawasser = await fetchWasserstand()
// console.log(datawasser)
var zahl6 = datawasser.indexOf("Letzter Messwert vom")
var stand01 = datawasser.slice(zahl6, zahl6 + 54)
var stand = stand01.slice(51,54)
var standneu = stand.replace("<","")
// console.log(stand01)
// console.log(standneu)

const widget = new ListWidget()
await createWidget()

if (!config.runsInWidget) {
 await widget.presentSmall()
}

Script.setWidget(widget)
Script.complete()

// Create the widget
async function createWidget() {
 //Hier kann die Überschrift des Widget angepasst werden
 const headlineText = widget.addText("🏊‍♂️ Alz-Seebruck")
 headlineText.font = Font.mediumRoundedSystemFont(14)
 const Text1 = widget.addText(lastmeasure)
 Text1.font = Font.mediumRoundedSystemFont(12)
 const Text5 = widget.addText("==============")
 Text5.font = Font.mediumRoundedSystemFont(12)
 const Text2 = widget.addText("Vortag  [°C]: " + hist)
 Text2.font = Font.mediumRoundedSystemFont(12)
 const Text4 = widget.addText("Aktuell [°C]: " + temp)
 Text4.font = Font.mediumRoundedSystemFont(12)
 const Text3 = widget.addText("OGewVO: " + orient)
 Text3.font = Font.mediumRoundedSystemFont(12)
 const Text6 = widget.addText("==============")
 Text6.font = Font.mediumRoundedSystemFont(12)
 const Text7 = widget.addText("📏 [cm]: " + standneu)
 Text7.font = Font.mediumRoundedSystemFont(12)
 if (standneu >= 150 && standneu < 180 ) {
   Text7.textColor = Color.yellow()
 }
 if (standneu >= 180 && standneu < 220 ) {
   Text7.textColor = Color.orange()
 }
 if (standneu >= 220) {
   Text7.textColor = Color.red()
 }

}

async function fetchData() {
 //Hier wird die Messstelle beim NID festgelegt
 const url = `https://www.nid.bayern.de/wassertemperatur/inn/seebruck-18403002`
 const request = new Request(url)
 const res = await request.loadString()
//   console.log(res)
 return res
}

async function fetchWasserstand() {
 //Hier wird die Messstelle beim HND festgelegt
 const url2 = `https://www.hnd.bayern.de/pegel/inn/seebruck-18403002?addhr=hr_w_hist`
 const request2 = new Request(url2)
 const reswasser = await request2.loadString()
//   console.log(reswasser)
 return reswasser
}

