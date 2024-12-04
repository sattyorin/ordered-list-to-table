import { Plugin } from "obsidian";

export default class OrderedListToTablePlugin extends Plugin {
    // 定数: クラス名や汎用的な値をまとめる
    private static readonly SVG_ICON_CLASS = "svg-icon right-triangle";
    private static readonly COPY_BUTTON_CLASS = "copy-code-button";

    async onload() {
        console.log("Ordered List to Table Plugin loaded");

        // Markdown レンダリング後に順序付きリストをテーブルに変換
        this.registerMarkdownPostProcessor((element: HTMLElement) => {
            const topLevelOrderedLists = this.getTopLevelOrderedLists(element);
            topLevelOrderedLists.forEach((orderedList) => this.convertOrderedListToTable(orderedList));
        });
    }

    onunload() {
        console.log("Ordered List to Table Plugin unloaded");
    }

    /**
     * DOM ツリーから最外部の順序付きリスト (<ol>) を取得
     * @param element - DOM のルート要素
     * @returns 最外部の順序付きリスト要素の配列
     */
    private getTopLevelOrderedLists(element: HTMLElement): HTMLElement[] {
        return Array.from(element.querySelectorAll<HTMLElement>("ol")).filter(
            (orderedList) => !orderedList.closest("ol ol") // 入れ子になった <ol> を除外
        );
    }

    /**
     * 順序付きリストをテーブルに変換
     * @param orderedList - 順序付きリスト (<ol>) 要素
     */
    private convertOrderedListToTable(orderedList: HTMLElement): void {
        try {
            this.removeUnnecessarySVGIcons(orderedList);
            this.wrapTextNodesInSpans(orderedList);
            this.removeUnnecessaryButtons(orderedList);
            this.replaceListWithTable(orderedList);

            console.log("Ordered list successfully converted to table");
        } catch (error) {
            console.error("Error while converting ordered list to table:", error);
        }
    }

    /**
     * 不要な SVG アイコンを削除
     * @param orderedList - 順序付きリスト (<ol>) 要素
     */
    private removeUnnecessarySVGIcons(orderedList: HTMLElement): void {
        orderedList.querySelectorAll<SVGElement>(`svg.${OrderedListToTablePlugin.SVG_ICON_CLASS}`).forEach((svgIcon) =>
            svgIcon.remove()
        );
    }

    /**
     * 順序付きリスト内のテキストノードを <span> タグで囲む
     * @param orderedList - 順序付きリスト (<ol>) 要素
     */
    private wrapTextNodesInSpans(orderedList: HTMLElement): void {
        orderedList.querySelectorAll<HTMLLIElement>("li[data-line]").forEach((listItem) => {
            const textNodesInListItem = Array.from(listItem.childNodes).filter(
                (node): node is Text =>
                    node.nodeType === Node.TEXT_NODE && Boolean(node.nodeValue?.trim())
            );
            textNodesInListItem.forEach((textNode) => {
                const spanWrapper = this.createSpanWithText(textNode.nodeValue!.trim());
                textNode.replaceWith(spanWrapper);
            });
        });
    }

    /**
     * 不要なボタンを削除
     * @param orderedList - 順序付きリスト (<ol>) 要素
     */
    private removeUnnecessaryButtons(orderedList: HTMLElement): void {
        orderedList.querySelectorAll<HTMLButtonElement>(`.${OrderedListToTablePlugin.COPY_BUTTON_CLASS}`).forEach(
            (button) => button.remove()
        );
    }

    /**
     * 順序付きリストをテーブルに変換して置換
     * @param orderedList - 順序付きリスト (<ol>) 要素
     */
    private replaceListWithTable(orderedList: HTMLElement): void {
        const table = document.createElement("table");
        const listItems = Array.from(orderedList.children);

        listItems.forEach((listItem, index) => {
            if (listItem instanceof HTMLLIElement) {
                const tableRow = document.createElement("tr");
                tableRow.appendChild(this.createIndexCell(index));
                tableRow.appendChild(this.createContentCell(listItem));
                table.appendChild(tableRow);
            }
        });

        orderedList.replaceWith(table);
    }

    /**
     * インデックス番号のセルを作成
     * @param index - 順序付きリストのアイテムのインデックス
     * @returns インデックス番号を持つテーブルセル
     */
    private createIndexCell(index: number): HTMLTableCellElement {
        const indexCell = document.createElement("td");
        indexCell.textContent = `${index + 1}.`;
        return indexCell;
    }

    /**
     * リストアイテムのコンテンツセルを作成
     * @param listItem - 順序付きリストのアイテム (<li>)
     * @returns コンテンツを持つテーブルセル
     */
    private createContentCell(listItem: HTMLLIElement): HTMLTableCellElement {
        const contentCell = document.createElement("td");
        Array.from(listItem.childNodes).forEach((childNode) => contentCell.appendChild(childNode));
        return contentCell;
    }

    /**
     * テキストを包む <span> 要素を作成
     * @param text - 包むテキスト
     * @returns テキストを持つ <span> 要素
     */
    private createSpanWithText(text: string): HTMLSpanElement {
        const spanWrapper = document.createElement("span");
        spanWrapper.classList.add("list-title");
        spanWrapper.textContent = text;
        return spanWrapper;
    }
}
