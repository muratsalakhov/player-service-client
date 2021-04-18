export default () => {}
// import {IChapter, IFrame, IScript} from "./interfaces";
//
// export interface IFakeData {
//     scripts: Array<IScript>
//     chapters: Array<IChapter>
//     frames: Array<IFrame>
// }
//
// export const fakeData: IFakeData = {
//     scripts: [
//         {
//             id: 'script000000000000000001',
//             name: 'Демоверсия ОП. Обход графа 1',
//             isActive: true,
//             dragDelta: 40,
//             dragTimeFactor: 1,
//             scrollMoveFactor: 1,
//             chapters: ['script01chapter000000001']
//         },
//         {
//             id: 'script000000000000000002',
//             name: 'Демоверсия ОП. Обход графа 2',
//             isActive: true,
//             dragDelta: 40,
//             dragTimeFactor: 1,
//             scrollMoveFactor: 1,
//             chapters: ['script02chapter000000001']
//         },
//         {
//             id: 'script000000000000000003',
//             name: 'Демоверсия ОП. Обход графа 3',
//             isActive: true,
//             dragDelta: 40,
//             dragTimeFactor: 1,
//             scrollMoveFactor: 1,
//             chapters: ['script03chapter000000001', 'script01chapter000000001']
//         }
//     ],
//     chapters: [
//         {
//             id: 'script01chapter000000001',
//             name: 'ЛКМ',
//             scriptId: 'script000000000000000001',
//             firstFrameId: 'script01chapter1frame000',
//             pictureWidth: 1003,
//             pictureHeight: 563,
//             chapterNumber: 1,
//             frames: [
//                 'script01chapter1frame000',
//                 'script01chapter1frame001',
//                 'script01chapter1frame002',
//                 'script01chapter1frame003',
//                 'script01chapter1frame004',
//                 'script01chapter1frame005',
//                 'script01chapter1frame006',
//                 'script01chapter1frame007',
//                 'script01chapter1frame008',
//                 'script01chapter1frame009'
//             ]
//         },
//         {
//             id: 'script02chapter000000001',
//             name: 'Комплекс действий',
//             scriptId: 'script000000000000000002',
//             firstFrameId: 'script02chapter1frame000',
//             pictureWidth: 1003,
//             pictureHeight: 563,
//             chapterNumber: 1,
//             frames: [
//                 'script02chapter1frame000',
//                 'script02chapter1frame001',
//                 'script02chapter1frame002',
//                 'script02chapter1frame003',
//                 'script02chapter1frame004',
//                 'script02chapter1frame005',
//                 'script02chapter1frame006',
//                 'script02chapter1frame007',
//                 'script02chapter1frame008',
//                 'script02chapter1frame009'
//             ]
//         },
//         {
//             id: 'script03chapter000000001',
//             name: 'Клавиши клавиатуры',
//             scriptId: 'script000000000000000003',
//             firstFrameId: 'script03chapter1frame000',
//             pictureWidth: 1003,
//             pictureHeight: 563,
//             chapterNumber: 1,
//             frames: [
//                 'script03chapter1frame000',
//                 'script03chapter1frame001',
//                 'script03chapter1frame002',
//                 'script03chapter1frame003',
//                 'script03chapter1frame004',
//                 'script03chapter1frame005',
//                 'script03chapter1frame006',
//                 'script03chapter1frame007',
//                 'script03chapter1frame008',
//                 'script03chapter1frame009'
//             ]
//         }
//     ],
//     frames: [
//         // Script 1
//         {
//             frameId: 'script01chapter1frame000',
//             pictureLink: '/demo_script/AbstractScript0.png',
//             underlying: true,
//             taskText: {
//                 id: '5e9c6f72af39871694239c81',
//                 text: 'Перейдите к следующему узлу графа'
//             },
//             hintText: {
//                 id: '5e9c6f75af39871694239c82',
//                 text: 'Кликни на узел дерева, соответствующий следующему кадру'
//             },
//             switchData: [{
//                 id: '5e9c6fa4af39871694239c83',
//                 nextFrameId: 'script01chapter1frame001',
//                 switchEvent: {
//                     actionId: 'LeftMouseClick',
//                     xleft: 201,
//                     xright: 283,
//                     yleft: 201,
//                     yright: 283
//                 }
//             }]
//         },
//         {
//             frameId: 'script01chapter1frame001',
//             pictureLink: '/demo_script/TransparentAbstractScript1.png',
//             underlying: true,
//             taskText: {
//                 id: '5e9c731daf39871694239c86',
//                 text: 'Перейдите к следующему узлу графа'
//             },
//             hintText: {
//                 id: '5e9c7322af39871694239c87',
//                 text: 'Кликни на узел дерева, соответствующий следующему кадру'
//             },
//             switchData: [
//                 {
//                     id: '5e9c77a6af39871694239c8f',
//                     nextFrameId: 'script01chapter1frame002',
//                     switchEvent: {
//                         actionId: 'LeftMouseClick',
//                         xleft: 361,
//                         xright: 443,
//                         yleft: 100,
//                         yright: 182
//                     }
//                 },
//                 {
//                     id: '5e9c7c8caf39871694239cae',
//                     nextFrameId: 'script01chapter1frame003',
//                     switchEvent: {
//                         actionId: 'LeftMouseClick',
//                         xleft: 361,
//                         xright: 443,
//                         yleft: 301,
//                         yright: 383
//                     }
//                 }
//             ]
//         },
//         {
//             frameId: 'script01chapter1frame002',
//             pictureLink: '/demo_script/TransparentAbstractScript2.png',
//             underlying: true,
//             taskText: {
//                 id: '5e9c7915af39871694239c94',
//                 text: 'Перейдите к следующему узлу графа'
//             },
//             hintText: {
//                 id: '5e9c7918af39871694239c95',
//                 text: 'Кликни на узел дерева, соответствующий следующему кадру'
//             },
//             switchData: [{
//                 id: '5e9c7921af39871694239c96',
//                 nextFrameId: 'script01chapter1frame007',
//                 switchEvent: {
//                     actionId: 'LeftMouseClick',
//                     xleft: 721,
//                     xright: 803,
//                     yleft: 100,
//                     yright: 182
//                 }
//             }]
//         },
//         {
//             frameId: 'script01chapter1frame003',
//             pictureLink: '/demo_script/TransparentAbstractScript3.png',
//             underlying: true,
//             taskText: {
//                 id: '5e9c7945af39871694239c98',
//                 text: 'Перейдите к следующему узлу графа'
//             },
//             hintText: {
//                 id: '5e9c7941af39871694239c97',
//                 text: 'Кликни на узел дерева, соответствующий следующему кадру'
//             },
//             switchData: [
//                 {
//                     id: '5e9c7d57af39871694239caf',
//                     nextFrameId: 'script01chapter1frame004',
//                     switchEvent: {
//                         actionId: 'LeftMouseClick',
//                         xleft: 521,
//                         xright: 603,
//                         yleft: 181,
//                         yright: 263
//                     }
//                 },
//                 {
//                     id: '5e9c7b4daf39871694239caa',
//                     nextFrameId: 'script01chapter1frame005',
//                     switchEvent: {
//                         actionId: 'LeftMouseClick',
//                         xleft: 521,
//                         xright: 603,
//                         yleft: 301,
//                         yright: 383
//                     }
//                 },
//                 {
//                     id: '5e9c7b50af39871694239cab',
//                     nextFrameId: 'script01chapter1frame006',
//                     switchEvent: {
//                         actionId: 'LeftMouseClick',
//                         xleft: 521,
//                         xright: 603,
//                         yleft: 420,
//                         yright: 502
//                     }
//                 }
//             ]
//         },
//         {
//             frameId: 'script01chapter1frame004',
//             pictureLink: '/demo_script/TransparentAbstractScript4.png',
//             underlying: true,
//             taskText: {
//                 id: '5e9c7956af39871694239c9a',
//                 text: 'Перейдите к следующему узлу графа'
//             },
//             hintText: {
//                 id: '5e9c7959af39871694239c9b',
//                 text: 'Кликни на узел дерева, соответствующий следующему кадру'
//             },
//             switchData: [{
//                 id: '5e9c7961af39871694239c9c',
//                 nextFrameId: 'script01chapter1frame008',
//                 switchEvent: {
//                     actionId: 'LeftMouseClick',
//                     xleft: 721,
//                     xright: 803,
//                     yleft: 301,
//                     yright: 383
//                 }
//             }]
//         },
//         {
//             frameId: 'script01chapter1frame005',
//             pictureLink: '/demo_script/TransparentAbstractScript5.png',
//             underlying: true,
//             taskText: {
//                 id: '5e9c7a08af39871694239c9d',
//                 text: 'Перейдите к следующему узлу графа'
//             },
//             hintText: {
//                 id: '5e9c7a0caf39871694239c9e',
//                 text: 'Кликни на узел дерева, соответствующий следующему кадру'
//             },
//             switchData: [{
//                 id: '5e9c7a10af39871694239c9f',
//                 nextFrameId: 'script01chapter1frame008',
//                 switchEvent: {
//                     actionId: 'LeftMouseClick',
//                     xleft: 721,
//                     xright: 803,
//                     yleft: 301,
//                     yright: 383
//                 }
//             }]
//         },
//         {
//             frameId: 'script01chapter1frame006',
//             pictureLink: '/demo_script/TransparentAbstractScript6.png',
//             underlying: true,
//             taskText: {
//                 id: '5e9c7a24af39871694239ca2',
//                 text: 'Перейдите к следующему узлу графа'
//             },
//             hintText: {
//                 id: '5e9c7a1faf39871694239ca1',
//                 text: 'Кликни на узел дерева, соответствующий следующему кадру'
//             },
//             switchData: [{
//                 id: '5e9c7a1baf39871694239ca0',
//                 nextFrameId: 'script01chapter1frame008',
//                 switchEvent: {
//                     actionId: 'LeftMouseClick',
//                     xleft: 721,
//                     xright: 803,
//                     yleft: 301,
//                     yright: 383
//                 }
//             }]
//         },
//         {
//             frameId: 'script01chapter1frame007',
//             pictureLink: '/demo_script/TransparentAbstractScript7.png',
//             underlying: true,
//             taskText: {
//                 id: '5e9c7a37af39871694239ca4',
//                 text: 'Перейдите к следующему узлу графа'
//             },
//             hintText: {
//                 id: '5e9c7a31af39871694239ca3',
//                 text: 'Кликни на узел дерева, соответствующий следующему кадру'
//             },
//             switchData: [{
//                 id: '5e9c7788af39871694239c8d',
//                 nextFrameId: 'script01chapter1frame009',
//                 switchEvent: {
//                     actionId: 'LeftMouseClick',
//                     xleft: 881,
//                     xright: 963,
//                     yleft: 201,
//                     yright: 283
//                 }
//             }]
//         },
//         {
//             frameId: 'script01chapter1frame008',
//             pictureLink: '/demo_script/TransparentAbstractScript8.png',
//             underlying: true,
//             taskText: {
//                 id: '5e9c7a45af39871694239ca6',
//                 text: 'Перейдите к следующему узлу графа'
//             },
//             hintText: {
//                 id: '5e9c7a41af39871694239ca5',
//                 text: 'Кликни на узел дерева, соответствующий следующему кадру'
//             },
//             switchData: [{
//                 id: '5e9c7764af39871694239c8b',
//                 nextFrameId: 'script01chapter1frame009',
//                 switchEvent: {
//                     actionId: 'LeftMouseClick',
//                     xleft: 881,
//                     xright: 963,
//                     yleft: 201,
//                     yright: 283
//                 }
//             }]
//         },
//         {
//             frameId: 'script01chapter1frame009',
//             pictureLink: '/demo_script/TransparentAbstractScript9.png',
//             underlying: true,
//             taskText: {
//                 id: '5e9c7a55af39871694239ca9',
//                 text: 'Перейдите к следующему узлу графа'
//             },
//             hintText: {
//                 id: '5e9c7a51af39871694239ca8',
//                 text: 'Кликни на узел дерева, соответствующий следующему кадру'
//             },
//             switchData: [{
//                 id: '5e9c7a4daf39871694239ca7',
//                 nextFrameId: null,
//                 switchEvent: {
//                     actionId: 'Pause',
//                     duration: 3000
//                 }
//             }]
//         },
//
//         // Script 2
//         {
//             frameId: 'script02chapter1frame000',
//             pictureLink: '/demo_script/AbstractScript0.png',
//             underlying: true,
//             taskText: {
//                 id: '5e9c6f72af39871694239c81',
//                 text: 'Перейдите к следующему узлу графа, используя левый клик мыши'
//             },
//             hintText: {
//                 id: '5e9c6f75af39871694239c82',
//                 text: 'Кликни на узел дерева, соответствующий следующему кадру'
//             },
//             switchData: [{
//                 id: '5e9c6fa4af39871694239c83',
//                 nextFrameId: 'script02chapter1frame001',
//                 switchEvent: {
//                     actionId: 'LeftMouseClick',
//                     xleft: 201,
//                     xright: 283,
//                     yleft: 201,
//                     yright: 283
//                 }
//             }]
//         },
//         {
//             frameId: 'script02chapter1frame001',
//             pictureLink: '/demo_script/AbstractScript1.png',
//             underlying: true,
//             taskText: {
//                 id: '5e9c731daf39871694239c86',
//                 text: 'Перейдите к следующему узлу графа, используя двойной левый клик мыши'
//             },
//             hintText: {
//                 id: '5e9c7322af39871694239c87',
//                 text: 'Кликни на узел дерева, соответствующий следующему кадру'
//             },
//             switchData: [
//                 {
//                     id: '6e9c77a6af39871694239c8f',
//                     nextFrameId: 'script02chapter1frame002',
//                     switchEvent: {
//                         actionId: 'LeftDoubleMouseClick',
//                         xleft: 361,
//                         xright: 443,
//                         yleft: 100,
//                         yright: 182
//                     }
//                 },
//                 {
//                     id: '5e9c7c8caf39871694239cae',
//                     nextFrameId: 'script02chapter1frame003',
//                     switchEvent: {
//                         actionId: 'LeftDoubleMouseClick',
//                         xleft: 361,
//                         xright: 443,
//                         yleft: 301,
//                         yright: 383
//                     }
//                 }
//             ]
//         },
//         {
//             frameId: 'script02chapter1frame002',
//             pictureLink: '/demo_script/AbstractScript2.png',
//             underlying: true,
//             taskText: {
//                 id: '5e9c7915af39871694239c94',
//                 text: 'Перейдите к следующему узлу графа, используя правый клик мыши'
//             },
//             hintText: {
//                 id: '5e9c7918af39871694239c95',
//                 text: 'Кликни на узел дерева, соответствующий следующему кадру'
//             },
//             switchData: [{
//                 id: '5e9c7921af39871694239c96',
//                 nextFrameId: 'script02chapter1frame007',
//                 switchEvent: {
//                     actionId: 5,
//                     xleft: 721,
//                     xright: 803,
//                     yleft: 100,
//                     yright: 182
//                 }
//             }]
//         },
//         {
//             frameId: 'script02chapter1frame003',
//             pictureLink: '/demo_script/AbstractScript3.png',
//             underlying: true,
//             taskText: {
//                 id: '5e9c7945af39871694239c98',
//                 text: 'Перейдите к следующему узлу графа, используя кливиши "с" или "shift" + "c", или "ctrl" + "c" на клавиатуре'
//             },
//             hintText: {
//                 id: '5e9c7941af39871694239c97',
//                 text: 'Кликни на узел дерева, соответствующий следующему кадру'
//             },
//             switchData: [
//                 {
//                     id: '5e9c7d57af39871694239caf',
//                     nextFrameId: 'script02chapter1frame004',
//                     switchEvent: {
//                         actionId: 9,
//                         key: 67
//                     }
//                 },
//                 {
//                     id: '5e9c7b4daf39871694239caa',
//                     nextFrameId: 'script02chapter1frame005',
//                     switchEvent: {
//                         actionId: 'KeyboardModClick',
//                         key: 67,
//                         modKey: 16
//                     }
//                 },
//                 {
//                     id: '5e9c7b50af39871694239cab',
//                     nextFrameId: 'script02chapter1frame006',
//                     switchEvent: {
//                         actionId: 'KeyboardModClick',
//                         key: 67,
//                         modKey: 17
//                     }
//                 }
//             ]
//         },
//         {
//             frameId: 'script02chapter1frame004',
//             pictureLink: '/demo_script/AbstractScript4.png',
//             underlying: true,
//             taskText: {
//                 id: '5e9c7956af39871694239c9a',
//                 text: 'Перейдите к следующему узлу графа, выполнив перетаскивание от узла 4 к узлу 9'
//             },
//             hintText: {
//                 id: '5e9c7959af39871694239c9b',
//                 text: 'Установите курсор на узел 4, зажмите левую клавишу мыши, перетащите курсор сначала к узлу 8, затем к узлу 9'
//             },
//             switchData: [{
//                 id: '5ea4dfa4af39871694239c83',
//                 nextFrameId: 'script02chapter1frame009',
//                 switchEvent: {
//                     actionId: 'Drag',
//                     xstartLeft: 521,
//                     ystartLeft: 181,
//                     xstartRight: 603,
//                     ystartRight: 263,
//                     xendLeft: 881,
//                     yendLeft: 201,
//                     xendRight: 963,
//                     yendRight: 283,
//                     pictures: [
//                         {
//                             pictureLink: '/demo_script/AbstractScript4.png',
//                             pictureNumber: 1,
//                             x: 562,
//                             y: 222
//                         },
//                         {
//                             pictureLink: '/demo_script/AbstractScript8.png',
//                             pictureNumber: 2,
//                             x: 762,
//                             y: 342
//                         },
//                         {
//                             pictureLink: '/demo_script/AbstractScript9.png',
//                             pictureNumber: 3,
//                             x: 922,
//                             y: 242
//                         }
//                     ]
//                 }
//             }]
//         },
//         {
//             frameId: 'script02chapter1frame005',
//             pictureLink: '/demo_script/AbstractScript5.png',
//             underlying: true,
//             taskText: {
//                 id: '5e9c7a08af39871694239c9d',
//                 text: 'Перейдите к следующему узлу графа прокруткой колёсика мыши вниз'
//             },
//             hintText: {
//                 id: '5e9c7a0caf39871694239c9e',
//                 text: 'Кликни на узел дерева, соответствующий следующему кадру'
//             },
//             switchData: [{
//                 id: '5e9c7a10af39871694239c9f',
//                 nextFrameId: 'script02chapter1frame008',
//                 switchEvent: {
//                     actionId: 'ScrollDown',
//                     xleft: 721,
//                     xright: 803,
//                     yleft: 301,
//                     yright: 383
//                 }
//             }]
//         },
//         {
//             frameId: 'script02chapter1frame006',
//             pictureLink: '/demo_script/AbstractScript6.png',
//             underlying: true,
//             taskText: {
//                 id: '5e9c7a24af39871694239ca2',
//                 text: 'Перейдите к следующему узлу графа прокруткой колёсика мыши вверх'
//             },
//             hintText: {
//                 id: '5e9c7a1faf39871694239ca1',
//                 text: 'Кликни на узел дерева, соответствующий следующему кадру'
//             },
//             switchData: [{
//                 id: '5e9c7961af39871694239c9c',
//                 nextFrameId: 'script02chapter1frame008',
//                 switchEvent: {
//                     actionId: 'ScrollUp',
//                     xleft: 721,
//                     xright: 803,
//                     yleft: 301,
//                     yright: 383
//                 }
//             }]
//         },
//         {
//             frameId: 'script02chapter1frame007',
//             pictureLink: '/demo_script/AbstractScript7.png',
//             underlying: true,
//             taskText: {
//                 id: '5e9c7a37af39871694239ca4',
//                 text: 'Перейдите к следующему узлу графа прокруткой колёсика мыши вверх'
//             },
//             hintText: {
//                 id: '5e9c7a31af39871694239ca3',
//                 text: 'Кликни на узел дерева, соответствующий следующему кадру'
//             },
//             switchData: [{
//                 id: '6e9c7788af39871694239c8d',
//                 nextFrameId: 'script02chapter1frame009',
//                 switchEvent: {
//                     actionId: 'ScrollUp',
//                     xleft: 881,
//                     xright: 963,
//                     yleft: 201,
//                     yright: 283
//                 }
//             }]
//         },
//         {
//             frameId: 'script02chapter1frame008',
//             pictureLink: '/demo_script/AbstractScript8.png',
//             underlying: true,
//             taskText: {
//                 id: '5e9c7a45af39871694239ca6',
//                 text: 'Перейдите к следующему узлу графа, используя левый клик мыши'
//             },
//             hintText: {
//                 id: '5e9c7a41af39871694239ca5',
//                 text: 'Кликни на узел дерева, соответствующий следующему кадру'
//             },
//             switchData: [{
//                 id: '6e9c7764af39871694239c8b',
//                 nextFrameId: 'script02chapter1frame009',
//                 switchEvent: {
//                     actionId: 'LeftMouseClick',
//                     xleft: 881,
//                     xright: 963,
//                     yleft: 201,
//                     yright: 283
//                 }
//             }]
//         },
//         {
//             frameId: 'script02chapter1frame009',
//             pictureLink: '/demo_script/AbstractScript9.png',
//             underlying: true,
//             taskText: {
//                 id: '5e9c7a55af39871694239ca9',
//                 text: 'Подождите 3 секунды'
//             },
//             hintText: {
//                 id: '5e9c7a51af39871694239ca8',
//                 text: 'Кликни на узел дерева, соответствующий следующему кадру'
//             },
//             switchData: [{
//                 id: '5e9c7a4daf39871694239ca7',
//                 nextFrameId: null,
//                 switchEvent: {
//                     actionId: 'Pause',
//                     duration: 3000
//                 }
//             }]
//         },
//
//         // Script 3
//         {
//             frameId: 'script03chapter1frame000',
//             pictureLink: '/demo_script/AbstractScript0.png',
//             underlying: true,
//             taskText: {
//                 id: '5e9c6f72af39871694239c81',
//                 text: '0. Нажмите клавишу клавиатуры, соответствующую следующему кадру'
//             },
//             hintText: {
//                 id: '5e9c6f75af39871694239c82',
//                 text: ''
//             },
//             taskVoice: {
//                 id: 'voice0000000000000000001',
//                 link: 'demo_script/task-voice-1-1.mp3'
//             },
//             switchData: [{
//                 id: '5e9c6fa4af39871694239c83',
//                 nextFrameId: 'script03chapter1frame001',
//                 switchEvent: {
//                     actionId: 9,
//                     key: 49
//                 }
//             }]
//         },
//         {
//             frameId: 'script03chapter1frame001',
//             pictureLink: '/demo_script/AbstractScript1.png',
//             underlying: true,
//             taskText: {
//                 id: '5e9c731daf39871694239c86',
//                 text: '1. Нажмите клавишу клавиатуры, соответствующую следующему кадру'
//             },
//             hintText: {
//                 id: '5e9c7322af39871694239c87',
//                 text: ''
//             },
//             taskVoice: {
//                 id: 'voice0000000000000000001',
//                 link: 'demo_script/task-voice-1-1.mp3'
//             },
//             switchData: [
//                 {
//                     id: '5e9c77a6af39871694239c8f',
//                     nextFrameId: 'script03chapter1frame002',
//                     switchEvent: {
//                         actionId: 9,
//                         key: 50
//                     }
//                 },
//                 {
//                     id: '5e9c7c8caf39871694239cae',
//                     nextFrameId: 'script03chapter1frame003',
//                     switchEvent: {
//                         actionId: 9,
//                         key: 51
//                     }
//                 }
//             ]
//         },
//         {
//             frameId: 'script03chapter1frame002',
//             pictureLink: '/demo_script/AbstractScript2.png',
//             underlying: true,
//             taskText: {
//                 id: '5e9c7915af39871694239c94',
//                 text: '2. Нажмите клавишу клавиатуры, соответствующую следующему кадру'
//             },
//             hintText: {
//                 id: '5e9c7918af39871694239c95',
//                 text: ''
//             },
//             taskVoice: {
//                 id: 'voice0000000000000000001',
//                 link: 'demo_script/task-voice-1-1.mp3'
//             },
//             switchData: [{
//                 id: '5e9c7921af39871694239c96',
//                 nextFrameId: 'script03chapter1frame007',
//                 switchEvent: {
//                     actionId: 9,
//                     key: 55
//                 }
//             }]
//         },
//         {
//             frameId: 'script03chapter1frame003',
//             pictureLink: '/demo_script/AbstractScript3.png',
//             underlying: true,
//             taskText: {
//                 id: '5e9c7945af39871694239c98',
//                 text: '3. Нажмите клавишу клавиатуры, соответствующую следующему кадру'
//             },
//             hintText: {
//                 id: '5e9c7941af39871694239c97',
//                 text: ''
//             },
//             taskVoice: {
//                 id: 'voice0000000000000000001',
//                 link: 'demo_script/task-voice-1-1.mp3'
//             },
//             switchData: [
//                 {
//                     id: '5e9c7d57af39871694239caf',
//                     nextFrameId: 'script03chapter1frame004',
//                     switchEvent: {
//                         actionId: 9,
//                         key: 52
//                     }
//                 },
//                 {
//                     id: '5e9c7b4daf39871694239caa',
//                     nextFrameId: 'script03chapter1frame005',
//                     switchEvent: {
//                         actionId: 9,
//                         key: 53
//                     }
//                 },
//                 {
//                     id: '5e9c7b50af39871694239cab',
//                     nextFrameId: 'script03chapter1frame006',
//                     switchEvent: {
//                         actionId: 9,
//                         key: 54
//                     }
//                 }
//             ]
//         },
//         {
//             frameId: 'script03chapter1frame004',
//             pictureLink: '/demo_script/AbstractScript4.png',
//             underlying: true,
//             taskText: {
//                 id: '5e9c7956af39871694239c9a',
//                 text: '4. Нажмите клавишу клавиатуры, соответствующую следующему кадру'
//             },
//             hintText: {
//                 id: '5e9c7959af39871694239c9b',
//                 text: ''
//             },
//             taskVoice: {
//                 id: 'voice0000000000000000001',
//                 link: 'demo_script/task-voice-1-1.mp3'
//             },
//             switchData: [{
//                 id: '5e9c7961af39871694239c9c',
//                 nextFrameId: 'script03chapter1frame008',
//                 switchEvent: {
//                     actionId: 9,
//                     key: 56
//                 }
//             }]
//         },
//         {
//             frameId: 'script03chapter1frame005',
//             pictureLink: '/demo_script/AbstractScript5.png',
//             underlying: true,
//             taskText: {
//                 id: '5e9c7a08af39871694239c9d',
//                 text: '5. Нажмите клавишу клавиатуры, соответствующую следующему кадру'
//             },
//             hintText: {
//                 id: '5e9c7a0caf39871694239c9e',
//                 text: ''
//             },
//             taskVoice: {
//                 id: 'voice0000000000000000001',
//                 link: 'demo_script/task-voice-1-1.mp3'
//             },
//             switchData: [{
//                 id: '5e9c7a10af39871694239c9f',
//                 nextFrameId: 'script03chapter1frame008',
//                 switchEvent: {
//                     actionId: 9,
//                     key: 56
//                 }
//             }]
//         },
//         {
//             frameId: 'script03chapter1frame006',
//             pictureLink: '/demo_script/AbstractScript6.png',
//             underlying: true,
//             taskText: {
//                 id: '5e9c7a24af39871694239ca2',
//                 text: '6. Нажмите клавишу клавиатуры, соответствующую следующему кадру'
//             },
//             hintText: {
//                 id: '5e9c7a1faf39871694239ca1',
//                 text: ''
//             },
//             taskVoice: {
//                 id: 'voice0000000000000000001',
//                 link: 'demo_script/task-voice-1-1.mp3'
//             },
//             switchData: [{
//                 id: '5e9c7a1baf39871694239ca0',
//                 nextFrameId: 'script03chapter1frame008',
//                 switchEvent: {
//                     actionId: 9,
//                     key: 56
//                 }
//             }]
//         },
//         {
//             frameId: 'script03chapter1frame007',
//             pictureLink: '/demo_script/AbstractScript7.png',
//             underlying: true,
//             taskText: {
//                 id: '5e9c7a37af39871694239ca4',
//                 text: '7. Нажмите клавишу клавиатуры, соответствующую следующему кадру'
//             },
//             hintText: {
//                 id: '5e9c7a31af39871694239ca3',
//                 text: ''
//             },
//             taskVoice: {
//                 id: 'voice0000000000000000001',
//                 link: 'demo_script/task-voice-1-1.mp3'
//             },
//             switchData: [{
//                 id: '5e9c7788af39871694239c8d',
//                 nextFrameId: 'script03chapter1frame009',
//                 switchEvent: {
//                     actionId: 9,
//                     key: 57
//                 }
//             }]
//         },
//         {
//             frameId: 'script03chapter1frame008',
//             pictureLink: '/demo_script/AbstractScript8.png',
//             underlying: true,
//             taskText: {
//                 id: '5e9c7a45af39871694239ca6',
//                 text: '8. Нажмите клавишу клавиатуры, соответствующую следующему кадру'
//             },
//             hintText: {
//                 id: '5e9c7a41af39871694239ca5',
//                 text: ''
//             },
//             taskVoice: {
//                 id: 'voice0000000000000000001',
//                 link: 'demo_script/task-voice-1-1.mp3'
//             },
//             switchData: [{
//                 id: '5e9c7764af39871694239c8b',
//                 nextFrameId: 'script03chapter1frame009',
//                 switchEvent: {
//                     actionId: 9,
//                     key: 57
//                 }
//             }]
//         },
//         {
//             frameId: 'script03chapter1frame009',
//             pictureLink: '/demo_script/AbstractScript9.png',
//             underlying: true,
//             taskText: {
//                 id: '5e9c7a55af39871694239ca9',
//                 text: '9. Подождите 3 секунды'
//             },
//             hintText: {
//                 id: '5e9c7a51af39871694239ca8',
//                 text: ''
//             },
//             taskVoice: {
//                 id: 'voice0000000000000000001',
//                 link: 'demo_script/task-voice-1-1.mp3'
//             },
//             switchData: [{
//                 id: '5e9c7a4daf39871694239ca7',
//                 nextFrameId: null,
//                 switchEvent: {
//                     actionId: 'Pause',
//                     duration: 3000
//                 }
//             }]
//         },
//     ]
// };