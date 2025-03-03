import { SplitControl } from "@/components/SplitControl";
import { Card, CardContent } from "@/components/ui/card";

const SplitPage = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SplitControl />
        <Card className="bg-tapir-card border-purple-500/20">
          <CardContent className="pt-6">
            <div className="text-white space-y-4">
              <h3 className="font-medium">About Splitting</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Splitting allows you to directly convert your ETH into both DP
                and YB tokens in a single transaction. Use the slider to adjust
                the ratio between the two tokens.
              </p>
              <ul className="text-sm text-gray-400 space-y-2 list-disc list-inside">
                <li>
                  DP (Depegging) tokens increase in value when USDT depegs
                </li>
                <li>YB (Yield Bearing) tokens earn yield from protocol fees</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SplitPage;
