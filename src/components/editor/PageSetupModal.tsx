import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PageMargins {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

interface PageSetupModalProps {
    isOpen: boolean;
    onClose: () => void;
    margins: PageMargins;
    onSave: (margins: PageMargins) => void;
}

export function PageSetupModal({
    isOpen,
    onClose,
    margins,
    onSave,
}: PageSetupModalProps) {
    const [localMargins, setLocalMargins] = useState<PageMargins>(margins);

    useEffect(() => {
        setLocalMargins(margins);
    }, [margins, isOpen]);

    const handleChange = (key: keyof PageMargins, value: string) => {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
            setLocalMargins((prev) => ({ ...prev, [key]: numValue }));
        }
    };

    const handleSave = () => {
        onSave(localMargins);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Page Setup</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="top">Top (cm)</Label>
                            <Input
                                id="top"
                                type="number"
                                step="0.1"
                                value={localMargins.top}
                                onChange={(e) => handleChange("top", e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="bottom">Bottom (cm)</Label>
                            <Input
                                id="bottom"
                                type="number"
                                step="0.1"
                                value={localMargins.bottom}
                                onChange={(e) => handleChange("bottom", e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="left">Left (cm)</Label>
                            <Input
                                id="left"
                                type="number"
                                step="0.1"
                                value={localMargins.left}
                                onChange={(e) => handleChange("left", e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="right">Right (cm)</Label>
                            <Input
                                id="right"
                                type="number"
                                step="0.1"
                                value={localMargins.right}
                                onChange={(e) => handleChange("right", e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>OK</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
